from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import datetime, time
from .models import *

@receiver(post_save, sender=Event)
def notify_employees_on_event_creation(sender, instance, created, **kwargs):
    if created:  # Проверяем, что событие только что создано
        company = instance.company
        employees = Employee.objects.filter(company=company)

        for employee in employees:
            message = f"A new activity is live! Join now and explore something exciting! New event: {instance.title} on {instance.date} at {instance.time}"
            Notification.objects.create(employee=employee, message=message)
            
@receiver(post_save, sender=EmployeeChallengeProgress)
def notify_on_challenge_completion(sender, instance, **kwargs):
    if instance.is_completed and "is_completed" in kwargs.get("update_fields", []):
        employee = instance.employee
        employee.diamonds += instance.challenge.reward_diamonds
        employee.save()

        message = f"You nailed it! Challenge complete—claim your well-earned points! Challenge completed: {instance.challenge.name}! You earned {instance.challenge.reward_diamonds} diamonds."
        Notification.objects.create(employee=employee, message=message)
    
    
@receiver(post_save, sender=Employee)
def notify_organizer_on_employee_signup(sender, instance, created, **kwargs):
    if created:
        company = instance.company
        message = f"New employee registered: {instance.nickname} ({instance.name} {instance.last_name})"
        OrganizerNotification.objects.create(company=company, message=message)
        
@receiver(post_save, sender=AttendanceRecord)
def notify_on_diamond_reward(sender, instance, created, **kwargs):
    if created:  # Only for new attendance records
        event = instance.event
        employee = instance.employee
        
        # Check if the event has diamonds to award
        if event.diamonds > 0:
            # Create notification
            message = f"You attended {event.title} and received {event.diamonds} diamonds!"
            Notification.objects.create(
                employee=employee,
                message=message
            )
            
            organizer_message = f"{employee.name} {employee.last_name} attended {event.title}"
            OrganizerNotification.objects.create(
                company=event.company,
                message=organizer_message
            )