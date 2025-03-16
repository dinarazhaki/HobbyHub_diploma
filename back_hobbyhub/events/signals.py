from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Event, Notification, Employee

@receiver(post_save, sender=Event)
def notify_employees_on_event_creation(sender, instance, created, **kwargs):
    if created:  # Проверяем, что событие только что создано
        company = instance.company
        employees = Employee.objects.filter(company=company)

        for employee in employees:
            message = f"New event: {instance.title} on {instance.date} at {instance.time}"
            Notification.objects.create(employee=employee, message=message)