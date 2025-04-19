from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from datetime import datetime, timedelta

class CompanyManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True or extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")
        return self.create_user(email, password, **extra_fields)

class Company(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255, verbose_name="Company Name")
    company_id = models.CharField(max_length=100, unique=True, verbose_name="Company ID")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date of Creation")
    email = models.EmailField(unique=True)
    profile_photo = models.ImageField(upload_to='organizer_profile_photos/', null=True, blank=True, verbose_name="Organizer Profile Photo")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CompanyManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "company_id"]

    def __str__(self):
        return str(self.company_id)

class Hobby(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Hobby Name")

    def __str__(self):
        return self.name
    
# Модель сотрудника
class Employee(models.Model):
    nickname = models.CharField(max_length=100, primary_key=True, verbose_name="Nickname")
    name = models.CharField(max_length=255, verbose_name="Name")
    last_name = models.CharField(max_length=255, verbose_name="Last Name")
    number = models.CharField(max_length=20, verbose_name="Number")
    join_date = models.DateField(verbose_name="Join Date")
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Date of Birth")
    receive_sms_notifications = models.BooleanField(default=True, verbose_name="Receive SMS Notifications")
    receive_email_notifications = models.BooleanField(default=True, verbose_name="Receive Email Notifications")
    receive_reminders = models.BooleanField(default=True, verbose_name="Receive Reminders")
    social_id = models.CharField(max_length=255, blank=True, null=True)  # ID из социальной сети
    social_provider = models.CharField(max_length=50, blank=True, null=True)  # Провайдер (Google, Facebook и т.д.)
    company = models.ForeignKey(
        Company, 
        to_field='company_id',
        on_delete=models.CASCADE, 
        verbose_name="Company"
    )
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], verbose_name="Gender")
    mail = models.EmailField(unique=True, verbose_name="Email")
    password = models.CharField(max_length=255, verbose_name="Password")
    is_approved = models.BooleanField(default=False, verbose_name="Approved")
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True, verbose_name="Profile Photo")
    hobbies = models.ManyToManyField(Hobby, blank=True, related_name='employees')
    diamonds = models.IntegerField(default=0, verbose_name="Diamonds")

    def completed_challenges_count(self):
        return self.challenge_progress.filter(is_completed=True).count()

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nickname

    

class Event(models.Model):
    EVENT_TYPES = [
        ('offline-outdoor', 'Offline - Outdoor'),
        ('offline-indoor', 'Offline - Indoor'),
        ('online', 'Online'),
    ]
    EVENT_STATUS = [
        ('upcoming', 'Upcoming'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    title = models.CharField(max_length=150)
    description = models.TextField()
    location = models.CharField(max_length=250)
    date = models.DateField()
    time = models.TimeField()
    event_type = models.CharField(max_length=15, choices=EVENT_TYPES, default='offline-indoor')
    status = models.CharField(max_length=12, choices=EVENT_STATUS, default='upcoming')
    hobbies = models.ManyToManyField(Hobby, related_name='events')  
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    company = models.ForeignKey(
        Company, 
        to_field='company_id',  
        on_delete=models.CASCADE, 
        related_name='events',
        verbose_name="Company"
    )
    diamonds = models.IntegerField(default=0, verbose_name="Diamonds")
    quota = models.IntegerField(default=10, verbose_name="Quota")     
    participants = models.ManyToManyField(Employee, related_name='events', blank=True)
    
    def __str__(self):
        return self.title
    def update_status(self):
        now = timezone.now()
        event_datetime = timezone.make_aware(
            timezone.datetime.combine(self.date, self.time)
        )
        if self.status == 'completed':
            return
            
        if now >= event_datetime:
            self.status = 'in_progress'
            self.save()
        else:
            self.status = 'upcoming'
            self.save()
    @property
    def spots_left(self):
        return self.quota - self.participants.count()


class LiveGame(models.Model):
    event = models.ForeignKey(
            Event,
            on_delete=models.CASCADE,
            related_name='live_games',
            verbose_name="Event"
        )
    title = models.CharField(max_length=255, verbose_name="Game Title")
    description = models.TextField(blank=True, null=True, verbose_name="Game Description")
    max_points = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"{self.title} - {self.event.title}"
    
class PointsAward(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    game = models.ForeignKey(LiveGame, on_delete=models.CASCADE)
    points = models.PositiveIntegerField()
    awarded_at = models.DateTimeField(auto_now_add=True)
    awarded_by = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.points} points to {self.employee} for {self.game}"

    
class AttendanceRecord(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendance_records')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)  # Changed from auto_now_add
    
    class Meta:
        unique_together = ('event', 'employee')
    
    def save(self, *args, **kwargs):
        # Set names automatically
        if self.employee:
            if not self.first_name:
                self.first_name = self.employee.name
            if not self.last_name:
                self.last_name = self.employee.last_name
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.employee.nickname} at {self.event.title} ({self.timestamp})"
    

class Prize(models.Model):
    name = models.CharField(max_length=255, verbose_name="Prize Name")
    description = models.TextField(verbose_name="Prize Description")
    image = models.ImageField(upload_to='prizes/', null=True, blank=True, verbose_name="Prize Image")
    rank = models.IntegerField(verbose_name="Rank") 
    company = models.ForeignKey('Company', on_delete=models.CASCADE, verbose_name="Company")
    deadline = models.DateField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['rank', 'company'],
                name='unique_rank_per_company'
            )
        ]

    def __str__(self):
        return f"{self.name} (Rank {self.rank})"
    
    
class Notification(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.employee.nickname}: {self.message}"
    
    
class OrganizerNotification(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="organizer_notifications")
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.company.company_id}: {self.message}"    
   
    
class Challenge(models.Model):
    name = models.CharField(max_length=255, verbose_name="Challenge Name")
    description = models.TextField(verbose_name="Challenge Description")
    type = models.CharField(
        max_length=50,
        choices=[
            ("activity", "Booking Challenges"),
            ("skill", "Skill Development"),
            ("competition", "Competition & Challenges"),
            ("xp", "Achievement Points"),
            ("consistency", "Consistency Challenges"),
            ("attendance", "Attendance Challenges"),
        ],
        verbose_name="Challenge Type",
    )
    goal = models.IntegerField(verbose_name="Goal (e.g., number of activities, XP, etc.)")
    reward_diamonds = models.IntegerField(default=0, verbose_name="Reward Diamonds")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, verbose_name="Company")

    def __str__(self):
        return self.name


class EmployeeChallengeProgress(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="challenge_progress")
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name="progress")
    progress = models.IntegerField(default=0, verbose_name="Progress")
    is_completed = models.BooleanField(default=False, verbose_name="Completed")

    def __str__(self):
        return f"{self.employee.nickname} - {self.challenge.name}"

    def save(self, *args, **kwargs):
        if self.progress >= self.challenge.goal:
            self.is_completed = True

        super().save(*args, **kwargs)
        