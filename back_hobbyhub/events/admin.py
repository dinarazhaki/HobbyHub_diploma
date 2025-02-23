from django.contrib import admin
from .models import *

# Настройка для модели Employee
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'name', 'last_name', 'company', 'is_approved')  # Поля, которые будут отображаться в списке
    list_filter = ('company', 'is_approved', 'gender')  # Фильтры справа
    search_fields = ('nickname', 'name', 'last_name', 'mail')  # Поля для поиска
    raw_id_fields = ('hobbies',)  # Заменяет выпадающий список на поле ввода ID для hobbies
    list_editable = ('is_approved',)  # Поле, которое можно редактировать прямо из списка

    # Настройка формы редактирования
    fieldsets = (
        (None, {
            'fields': ('nickname', 'name', 'last_name', 'company', 'gender', 'mail', 'password')
        }),
        ('Дополнительно', {
            'fields': ('number', 'join_date', 'date_of_birth', 'profile_photo', 'diamonds', 'hobbies', 'is_approved'),
            'classes': ('collapse',)  # Сворачиваемый блок
        }),
    )

# Inline-форма для хобби (если хотите управлять хобби прямо на странице сотрудника)
class HobbyInline(admin.TabularInline):
    model = Employee.hobbies.through  # Используем through-модель для ManyToManyField
    extra = 1  # Количество пустых форм для добавления новых хобби

# Настройка для модели Event
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'company',  'spots_left')  # Поля в списке
    list_filter = ('company', 'date')  # Фильтры справа
    search_fields = ('title', 'description', 'location')  # Поля для поиска
    raw_id_fields = ('hobbies','participants')  # Заменяет выпадающий список на поле ввода ID для hobbies

    # Добавляем вычисляемое поле в список
    @admin.display(description='Осталось мест')
    def spots_left(self, obj):
        return obj.spots_left

# Настройка для модели Hobby
class HobbyAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Поля в списке
    search_fields = ('name',)  # Поля для поиска

# Настройка для модели Company
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'company_id', 'email', 'created_at')  # Поля в списке
    search_fields = ('name', 'company_id', 'email')  # Поля для поиска

# Регистрация моделей с кастомизацией
admin.site.register(Event, EventAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Hobby, HobbyAdmin)