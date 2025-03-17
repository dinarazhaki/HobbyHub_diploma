from django.http import JsonResponse
from django.shortcuts import render, redirect,  get_object_or_404
from .models import *
from django.core.serializers import serialize
import json
from django.contrib import messages
from django.contrib.auth.hashers import check_password, make_password
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from functools import wraps
from django.urls import reverse
from django.views.decorators.http import require_http_methods

    
def role_required(role):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if role == "employee" and not request.session.get("nickname"):
                return redirect(f"/sign_in/?next={request.get_full_path()}")
            if role == "organizer" and not request.session.get("company_id"):
                return redirect(f"/sign_in/?next={request.get_full_path()}")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def approval_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        nickname = request.session.get("nickname")
        if not nickname:
            return redirect("sign_in") 

        user = Employee.objects.filter(nickname=nickname).first()
        if not user or not user.is_approved:  
            return redirect("") 

        return view_func(request, *args, **kwargs) 

    return _wrapped_view


def activity_details(request, event_id):
    event = get_object_or_404(Event, id=event_id) 
    nickname = request.session.get("nickname")
    user_is_registered = False

    if nickname:
        try:
            employee = Employee.objects.get(nickname=nickname)
            user_is_registered = event.participants.filter(nickname=nickname).exists()
        except Employee.DoesNotExist:
            pass

    return render(request, 'activity_details.html', {
        'event': event,
        'user_is_registered': user_is_registered,
    })
    
@csrf_exempt
def apply_to_event(request, event_id):
    if request.method == 'POST':
        nickname = request.session.get('nickname')
        if not nickname:
            return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)

        try:
            employee = Employee.objects.get(nickname=nickname)
            event = get_object_or_404(Event, id=event_id)

            # Проверяем, не записан ли уже сотрудник
            if event.participants.filter(nickname=nickname).exists():
                return JsonResponse({"status": "error", "message": "You are already registered for this event"}, status=400)

            # Проверяем, есть ли свободные места
            if event.spots_left <= 0:
                return JsonResponse({"status": "error", "message": "No spots left"}, status=400)

            # Записываем сотрудника на ивент
            event.participants.add(employee)
            event.save()

            # Обновляем прогресс в вызовах
            update_activity_progress(employee, 1)  # Убедитесь, что эта строка выполняется

            return JsonResponse({
                "status": "success",
                "message": "You have successfully registered for the event",
                "spots_left": event.spots_left,
            })
        except Employee.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Employee not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def cancel_event_registration(request, event_id):
    if request.method == 'POST':
        nickname = request.session.get('nickname')
        if not nickname:
            return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)

        try:
            employee = Employee.objects.get(nickname=nickname)
            event = get_object_or_404(Event, id=event_id)

            # Проверяем, записан ли сотрудник на ивент
            if not event.participants.filter(nickname=nickname).exists():
                return JsonResponse({"status": "error", "message": "You are not registered for this event"}, status=400)

            # Отменяем запись сотрудника на ивент
            event.participants.remove(employee)
            event.save()
            update_activity_progress(employee, -1)

            return JsonResponse({
                "status": "success",
                "message": "You have successfully canceled your registration for the event",
                "spots_left": event.spots_left,
            })
        except Employee.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Employee not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@role_required("employee")
@approval_required
def user_activities(request):
    today = timezone.now().date()  # Получаем текущую дату

    # Получаем сотрудника из сессии
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    try:
        employee = Employee.objects.get(nickname=nickname)
    except Employee.DoesNotExist:
        return redirect("sign_in")

    # Получаем компанию сотрудника
    company = employee.company

    # Получаем все события компании
    events = Event.objects.filter(company=company)

    # Получаем хобби сотрудника
    hobbies = Hobby.objects.all()

    # Разделяем события на сегодняшние и остальные
    today_events = []
    other_events = []

    for event in events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'location': event.location,
            'date': event.date.strftime('%Y-%m-%d'),
            'time': event.time.strftime('%H:%M'),
            'hobbies': [hobby.name for hobby in event.hobbies.all()],  # Все хобби события
            'image': event.image.url if event.image else None,
        }

        if event.date == today:
            today_events.append(event_data)
        else:
            other_events.append(event_data)
            
        events_data = json.dumps({
                'today_events': today_events,
                'other_events': other_events,
        })
    return render(request, 'user_activities.html', {
        'today_events': today_events,
        'other_events': other_events,
        'hobbies': hobbies,
        'events_data': events_data,
    })
    
    

@csrf_exempt
def approve_employee(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nickname = data.get('nickname')

        try:
            employee = Employee.objects.get(nickname=nickname)
            employee.is_approved = True  
            employee.save()
            return JsonResponse({'success': True})
        except Employee.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Employee not found'})

@csrf_exempt
def deny_employee(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nickname = data.get('nickname')

        try:
            employee = Employee.objects.get(nickname=nickname)
            employee.delete() 
            return JsonResponse({'success': True})
        except Employee.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Employee not found'})      

@role_required("organizer")
def employees(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.get(id=company_id)
    
    new_requests = Employee.objects.filter(company=company, is_approved=False)
    approved_employees = Employee.objects.filter(company=company, is_approved=True)

    return render(request, "employees.html", {"new_requests": new_requests, "approved_employees": approved_employees})


def get_employee_requests(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    employees = Employee.objects.filter(company_id=company_id, is_approved=False).values(
        "nickname", "name", "last_name", "number", "join_date", "mail"
    )
    return JsonResponse({"employees": list(employees)})

@role_required("organizer")
def organizer_profile(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")

    return render(request, "organizerprofile.html", {"company": company})

#editing
@role_required("employee")
def hobbies(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")

    hobbies = Hobby.objects.all()
    hobbies_json = json.dumps(list(hobbies.values("id", "name")))
    user_hobbies = list(user.hobbies.values_list("id", flat=True))  # Получаем ID хобби пользователя
    return render(
        request,
        "hobbies.html",
        {"hobbies": hobbies, "hobbies_json": hobbies_json, "user_hobbies": user_hobbies},
    )



def save_hobbies(request):
    if request.method == 'POST':
        nickname = request.session.get('nickname')
        if not nickname:
            return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)

        user = Employee.objects.filter(nickname=nickname).first()
        if not user:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

        try:
            selected_hobbies = request.POST.getlist('hobbies[]')
            hobbies = Hobby.objects.filter(id__in=selected_hobbies)
            user.hobbies.set(hobbies)
            return JsonResponse({"status": "success", "redirect_url": reverse("sign_in")})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@role_required("employee")
@approval_required
def user_profile(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")
    hobbies = user.hobbies.all() 
    return render(request, "userprofile.html", {"user": user, "hobbies": hobbies})

def sign_up(request):
    companies = Company.objects.all()  # Для отображения списка компаний в форме

    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        number = request.POST.get('number')
        company_id = request.POST.get('company_id')  # Получаем company_ID из формы
        gender = request.POST.get('gender')
        email = request.POST.get('email')
        password = request.POST.get('password')
        date_of_birth = request.POST.get('date_of_birth')  # Получаем строку с датой рождения
        if not date_of_birth:
            messages.error(request, 'Invalid date format for Date of Birth.')
            return render(request, 'sign_up.html', {'companies': companies})

        # Проверка на существование компании по полю company_id
        try:
            company = Company.objects.get(company_id=company_id)
        except Company.DoesNotExist:
            messages.error(request, 'Company with the provided ID does not exist.')
            return render(request, 'sign_up.html', {'companies': companies})

        # Создание нового сотрудника
        try:
            employee = Employee.objects.create(
                nickname=nickname,
                name=first_name,
                last_name=last_name,
                number=number,
                join_date=timezone.now().date(),
                company=company,  # Привязываем компанию через company_id
                gender=gender,
                mail=email,
                password=make_password(password),  # Хешируем пароль!
                date_of_birth=date_of_birth  # Добавляем дату рождения

            )
            request.session['nickname'] = employee.nickname

            messages.success(request, 'Employee registered successfully!')
            return redirect('hobbies')
        except IntegrityError:
            messages.error(request, 'An employee with this email or nickname already exists.')
            return render(request, 'sign_up.html', {'companies': companies})
    else:
        return render(request, 'sign_up.html', {'companies': companies})
    


def guest_page(request):
    return render(request, 'guest.html')


@role_required("organizer")
def organizer_view(request):
    events = Event.objects.all()
    return render(request, 'organizer.html', {'events': events})

@role_required("employee")
@approval_required
def user_view(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    try:
        employee = Employee.objects.get(nickname=nickname)
    except Employee.DoesNotExist:
        return redirect("sign_in")

    company_events = Event.objects.filter(company=employee.company)

    registered_events = employee.events.all()

    events_json = serialize('json', company_events, fields=('title', 'date', 'location', 'image'))
    events_data = json.loads(events_json)

    return render(request, 'user.html', {
        'events': company_events,  # Все события компании
        'registered_events': registered_events,  # События, на которые сотрудник зарегистрировался
        'events_data': events_data,
    })

def profile_user_act(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    try:
        employee = Employee.objects.get(nickname=nickname)
        registered_events = employee.events.all()  # Получаем все ивенты, на которые записан сотрудник
    except Employee.DoesNotExist:
        return redirect("sign_in")

    return render(request, 'profile_user_act.html', {
        'user': employee,
        'registered_events': registered_events,  # Передаем записанные ивенты в шаблон
    })

@role_required("employee")
@approval_required
def user_achievements(request):
    nickname=request.session.get("nickname")

    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")
    return render(request, 'user_achievements.html', {"user":user})


@role_required("employee")
@approval_required
def user_language(request):
    nickname=request.session.get("nickname")

    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")
    return render(request, 'language_options.html', {"user":user})

@role_required("employee")
@approval_required
def user_notification(request):
    nickname=request.session.get("nickname")

    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")
    return render(request, 'notif_preferences.html', {"user":user})

@role_required("employee")
@approval_required
def user_privacy(request):
    nickname=request.session.get("nickname")

    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")
    return render(request, 'privacy_settings.html', {"user":user})


@role_required("employee")
@approval_required
def update_user_profile(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")

    if request.method == "POST":
        user.name = request.POST.get("name", user.name)
        user.last_name = request.POST.get("last_name", user.last_name)
        user.mail = request.POST.get("mail", user.mail)
        user.gender = request.POST.get("gender", user.gender)
        user.date_of_birth = request.POST.get("date_of_birth", user.date_of_birth)
        new_password = request.POST.get("password")
        if new_password:
            user.password = make_password(new_password)

        if "profile_photo" in request.FILES:
            image = request.FILES["profile_photo"]
            file_path = f"profile_photos/{nickname}_{image.name}"

            if user.profile_photo and default_storage.exists(user.profile_photo.path):
                default_storage.delete(user.profile_photo.path)

            user.profile_photo.save(file_path, ContentFile(image.read()))

        selected_hobby_ids = request.POST.getlist('hobbies[]')
        user.hobbies.set(Hobby.objects.filter(id__in=selected_hobby_ids))

        user.save()
        return redirect("user_setting")

    return redirect("user_setting")

@role_required("employee")
@approval_required
def user_setting(request):
    nickname=request.session.get("nickname")
    all_hobbies = Hobby.objects.all()

    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")
    return render(request, 'user_setting.html', {"user":user, 'all_hobbies': all_hobbies})


def remove_user_profile_photo(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")

    if request.method == "POST":
        if user.profile_photo:
            if default_storage.exists(user.profile_photo.path):
                default_storage.delete(user.profile_photo.path)
            user.profile_photo = None
            user.save()

    return redirect("user_setting")


def remove_organizer_profile_photo(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")

    if request.method == "POST":
        if company.profile_photo:
            if default_storage.exists(company.profile_photo.path):
                default_storage.delete(company.profile_photo.path)
            company.profile_photo = None
            company.save()

    return redirect("organizer_settings")


@role_required("organizer")
def organizer_settings(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")

    return render(request, "organizer_setting.html", {"company": company})

@role_required("organizer")
def update_organizer_profile(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")

    if request.method == "POST":
        company.name = request.POST.get("name", company.name)
        company.email = request.POST.get("email", company.email)

        new_password = request.POST.get("password")
        if new_password:
            company.password = make_password(new_password)

        if "profile_photo" in request.FILES:
            image = request.FILES["profile_photo"]
            file_path = f"profile_photo/{company_id}_{image.name}"
            company.profile_photo.save(file_path, ContentFile(image.read()))

        company.save()
        return redirect("organizer_settings")

    return redirect("organizer_settings")

@role_required("organizer")
def organizer_language(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")
    return render(request, 'organizer_language_options.html', {"company": company})

@role_required("organizer")
def organizer_notification(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")
    return render(request, 'organizer_notif_preferences.html', {"company": company})

@role_required("organizer")
def organizer_privacy(request):
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    company = Company.objects.filter(id=company_id).first()
    if not company:
        return redirect("sign_in")
    return render(request, 'organizer_privacy_settings.html', {"company": company})


def sign_in(request):
    if request.method == "POST":
        user_type = request.POST.get("user_type")
        email = request.POST.get("email")
        password = request.POST.get("password")
        next_url = request.POST.get("next")  # Получаем URL для перенаправления

        # Проверяем, есть ли активная сессия
        if request.session.get("company_id") or request.session.get("nickname"):
            request.session.flush()  # Завершаем текущую сессию

        # Авторизация компании
        if user_type == "company":
            company = Company.objects.filter(email=email).first()
            if company and check_password(password, company.password):
                request.session["company_id"] = company.id
                return redirect(next_url or "organizer_view")
        # Авторизация сотрудника
        elif user_type == "employee":
            employee = Employee.objects.filter(mail=email).first()
            if employee and check_password(password, employee.password):
                if not employee.is_approved:
                    return render(request, "guest.html", {"employee": employee})
                request.session["nickname"] = employee.nickname
                return redirect(next_url or "user_view")
        messages.error(request, "Invalid credentials. Please try again.")

    return render(request, "sign_in.html")


#Activity list for organizers

def organizer_activities(request):
    today = timezone.now().date()
    company_id = request.session.get("company_id")
    if not company_id:
        return redirect("sign_in")

    try:
        current_company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return redirect("sign_in")

    events = Event.objects.filter(company=current_company)
    hobbies = Hobby.objects.all()

    today_events = []
    other_events = []

    for event in events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'location': event.location,
            'date': event.date.strftime('%Y-%m-%d'),
            'time': event.time.strftime('%H:%M'),
            'hobbies': [hobby.name for hobby in event.hobbies.all()],  # Все хобби события
            'image': event.image.url if event.image else None,
            'quota': event.quota,  # Общая квота
            'participants_count': event.participants.count()
        }

        if event.date == today:
            today_events.append(event_data)
        else:
            other_events.append(event_data)

    return render(request, 'organizer_activities.html', {
        'today_events': today_events,
        'other_events': other_events,
        'hobbies': hobbies,
    })

def create_event(request):
    if request.method == 'POST':
        company_id = request.session.get("company_id")
        if not company_id:
            return redirect("sign_in")

        try:
            current_company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return redirect("sign_in")

        event = Event(
            title=request.POST.get('event-name'),
            description=request.POST.get('event-description'),
            location=request.POST.get('event-location'),
            date=request.POST.get('event-date'),
            time=request.POST.get('event-time'),
            diamonds=request.POST.get('event-diamonds'),
            quota=request.POST.get('event-quota'),
            company=current_company,
        )

        if 'event-image' in request.FILES:
            event.image = request.FILES['event-image']

        event.save()

        # Добавляем хобби к событию
        selected_hobbies = request.POST.get('event-hobbies').split(',')
        for hobby_name in selected_hobbies:
            hobby, _ = Hobby.objects.get_or_create(name=hobby_name.strip())
            event.hobbies.add(hobby)

        return redirect('activities')

    return render(request, 'organizer_activities.html')


@csrf_exempt
def delete_event(request, event_id):
    if request.method == 'DELETE':
        try:
            event = Event.objects.get(id=event_id)
            event.delete()
            return JsonResponse({'success': True})
        except Event.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Event not found'}, status=404)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=400)


@csrf_exempt
def get_event_details(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'location': event.location,
            'date': event.date.strftime('%Y-%m-%d'),
            'time': event.time.strftime('%H:%M'),
            'diamonds': event.diamonds,
            'quota': event.quota,
            'hobbies': [hobby.name for hobby in event.hobbies.all()],  # Список хобби
        }
        return JsonResponse({'success': True, 'event': event_data})
    except Event.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Event not found'}, status=404)

@csrf_exempt
def edit_event(request, event_id):
    if request.method == 'POST':
        try:
            event = Event.objects.get(id=event_id)
            event.title = request.POST.get('title', event.title)
            event.description = request.POST.get('description', event.description)
            event.location = request.POST.get('location', event.location)
            event.date = request.POST.get('date', event.date)
            event.time = request.POST.get('time', event.time)
            event.diamonds = request.POST.get('diamonds', event.diamonds)
            event.quota = request.POST.get('quota', event.quota)

            if 'image' in request.FILES:
                event.image = request.FILES['image']

            # Обновляем хобби (только существующие)
            selected_hobbies = request.POST.get('hobbies', '').split(',')
            event.hobbies.clear()
            for hobby_name in selected_hobbies:
                hobby_name = hobby_name.strip()
                if hobby_name:  # Проверяем, что название хобби не пустое
                    try:
                        hobby = Hobby.objects.get(name=hobby_name)  # Ищем существующее хобби
                        event.hobbies.add(hobby)
                    except Hobby.DoesNotExist:
                        # Если хобби не существует, игнорируем его
                        continue

            event.save()
            return JsonResponse({'success': True})
        except Event.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Event not found'}, status=404)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=400)

@role_required("employee")
@approval_required
def leaderboard(request):
    if request.session.get("nickname"):
        current_user = Employee.objects.get(nickname=request.session["nickname"])
        company = current_user.company

        employees = Employee.objects.filter(company=company, is_approved=True).order_by('-diamonds')
        prizes = Prize.objects.filter(company=company).order_by('rank')

        current_user_rank = list(employees).index(current_user) + 1

        return render(request, 'leaderboard.html', {
            'employees': employees,
            'current_user_rank': current_user_rank,
            'current_user': current_user,
            'prizes': prizes,
        })
    else:
        return redirect('sign_in')
    
@role_required("organizer")
def leaderboard_show(request):
    employees = Employee.objects.filter(is_approved=True).order_by('-diamonds')

    if request.session.get("company_id"):
        company_id = request.session["company_id"]
        company = Company.objects.get(id=company_id)

        # Получаем сотрудников компании, отсортированных по diamonds
        employees = Employee.objects.filter(company=company, is_approved=True).order_by('-diamonds')

        # Получаем призы для компании
        prizes = Prize.objects.filter(company=company).order_by('rank')

        return render(request, 'leaderboard_show.html', {
            'employees': employees,
            'prizes': prizes,
        })
    else:
        return redirect('sign_in')
    
def add_prize(request):
    if request.session.get("company_id"):
        if request.method == 'POST':
            name = request.POST.get('name')
            description = request.POST.get('description')
            rank = request.POST.get('rank')
            image = request.FILES.get('image')
            company_id = request.session["company_id"]

            # Проверяем, существует ли приз с таким рангом в этой компании
            if Prize.objects.filter(rank=rank, company_id=company_id).exists():
                messages.error(request, "A prize with this rank already exists for your company.")
                return redirect('leaderboard_show')

            # Создаем приз
            Prize.objects.create(
                name=name,
                description=description,
                rank=rank,
                image=image,
                company_id=company_id
            )
            messages.success(request, "Prize added successfully!")
            return redirect('leaderboard_show')
        return render(request, 'add_prize.html')
    else:
        return redirect('sign_in')
        
def edit_prize(request, prize_id):
    if request.session.get("company_id"):
        prize = get_object_or_404(Prize, id=prize_id, company_id=request.session["company_id"])
        if request.method == 'POST':
            prize.name = request.POST.get('name')
            prize.description = request.POST.get('description')
            prize.rank = request.POST.get('rank')
            if 'image' in request.FILES:
                prize.image = request.FILES['image']
            prize.save()
            return redirect('leaderboard_show')
        return render(request, 'edit_prize.html', {'prize': prize})
    else:
        return redirect('sign_in')
    
def delete_prize(request, prize_id):
    if request.session.get("company_id"):
        prize = get_object_or_404(Prize, id=prize_id, company_id=request.session["company_id"])
        prize.delete()
    return redirect('leaderboard_show')


#Profile_Lookup view
def profile_lookup(request):
    employees = Employee.objects.filter(is_approved=True)
    nickname = request.session.get("nickname")

    if not nickname:
        return render(request, 'profile_lookup.html', {'employees': employees, 'error': "User not found."})

    try:
        user = Employee.objects.filter(nickname=nickname).first()
        hobbies = user.hobbies.all()
    except Employee.DoesNotExist:
        hobbies = None  # Handle missing user gracefully

    return render(request, 'profile_lookup.html', {
        'employees': employees,
        'hobbies': hobbies
    })

@role_required("employee")
@approval_required
@require_http_methods(["GET", "POST"])
def user_notification(request):
    nickname = request.session.get("nickname")

    if not nickname:
        return redirect("sign_in")

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return redirect("sign_in")

    if request.method == "POST":
        user.receive_sms_notifications = request.POST.get("sms") == "on"
        user.receive_email_notifications = request.POST.get("email") == "on"
        user.receive_reminders = request.POST.get("reminders") == "on"
        user.save()
        return redirect("user_notification")

    return render(request, 'notif_preferences.html', {"user": user})


@require_http_methods(["GET"])
def get_notifications(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    user = Employee.objects.filter(nickname=nickname).first()
    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    notifications = Notification.objects.filter(employee=user).order_by("-timestamp")
    notifications_data = [
        {"message": notif.message, "timestamp": notif.timestamp.strftime("%Y-%m-%d %H:%M")}
        for notif in notifications
    ]

    return JsonResponse({"notifications": notifications_data})


def update_competition_progress(employee, wins):
    challenges = Challenge.objects.filter(type="competition", company=employee.company)
    for challenge in challenges:
        progress, created = EmployeeChallengeProgress.objects.get_or_create(
            employee=employee, challenge=challenge
        )
        progress.progress += wins
        progress.save()


def update_skill_progress(employee, sessions):
    challenges = Challenge.objects.filter(type="skill", company=employee.company)
    for challenge in challenges:
        progress, created = EmployeeChallengeProgress.objects.get_or_create(
            employee=employee, challenge=challenge
        )
        progress.progress += sessions
        progress.save()

        if progress.progress >= challenge.goal and not progress.is_completed:
            progress.is_completed = True
            progress.save()

            # Добавляем diamonds сотруднику
            employee.diamonds += challenge.reward_diamonds
            employee.save()

            # Отправляем уведомление
            message = f"Challenge completed: {challenge.name}! You earned {challenge.reward_diamonds} diamonds."
            Notification.objects.create(employee=employee, message=message)

def update_activity_progress(employee, activities):
    challenges = Challenge.objects.filter(type="activity", company=employee.company)
    for challenge in challenges:
        progress, created = EmployeeChallengeProgress.objects.get_or_create(
            employee=employee, challenge=challenge
        )
        if progress.is_completed:
            continue  # Пропустить, если вызов уже завершен

        progress.progress += activities
        if progress.progress >= challenge.goal:
            progress.is_completed = True
            progress.save(update_fields=["progress", "is_completed"])  # Сохраняем только нужные поля

            # Добавляем награду (diamonds) сотруднику
            employee.diamonds += challenge.reward_diamonds
            employee.save()

            # Отправляем уведомление
            message = f"Challenge completed: {challenge.name}! You earned {challenge.reward_diamonds} diamonds."
            Notification.objects.create(employee=employee, message=message)
        else:
            progress.save(update_fields=["progress"])  # Сохраняем прогресс, если вызов не завершен                                
            
def update_xp_progress(employee, xp_earned):
    challenges = Challenge.objects.filter(type="xp", company=employee.company)
    for challenge in challenges:
        progress, created = EmployeeChallengeProgress.objects.get_or_create(
            employee=employee, challenge=challenge
        )
        progress.progress += xp_earned
        progress.save()
        
@csrf_exempt
def update_xp(request):
    if request.method == "POST":
        nickname = request.session.get("nickname")
        if not nickname:
            return JsonResponse({"success": False, "error": "User not authenticated"})

        employee = Employee.objects.filter(nickname=nickname).first()
        if not employee:
            return JsonResponse({"success": False, "error": "User not found"})

        data = json.loads(request.body)
        xp_earned = data.get("xp", 0)
        update_xp_progress(employee, xp_earned)
        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "error": "Invalid request method"})


def challenges(request):
    nickname = request.session.get("nickname")
    if not nickname:
        return redirect("sign_in")

    employee = Employee.objects.filter(nickname=nickname).first()
    if not employee:
        return redirect("sign_in")

    challenges_data = []
    challenges = Challenge.objects.filter(company=employee.company)
    for challenge in challenges:
        progress, created = EmployeeChallengeProgress.objects.get_or_create(
            employee=employee, challenge=challenge
        )
        challenges_data.append({
            "name": challenge.name,
            "description": challenge.description,
            "progress": progress.progress,
            "goal": challenge.goal,
            "progress_percentage": (progress.progress / challenge.goal) * 100,
            "is_completed": progress.is_completed,
        })

    return render(request, "challenges.html", {"challenges": challenges_data})

