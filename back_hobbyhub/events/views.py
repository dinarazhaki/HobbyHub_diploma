from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import *
from django.core.serializers import serialize
import json
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password, make_password
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from functools import wraps






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


@csrf_exempt
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
            return redirect("sign_in")
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)


@role_required("employee")
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
def user_view(request):
    events = Event.objects.all()
    events_json = serialize('json', events, fields=('title', 'date', 'location', 'image'))
    events_data = json.loads(events_json)
    return render(request, 'user.html', {'events': events, 'events_data': events_data})


def profile_user_act(request):
    return render(request, 'profile_user_act.html')

def user_achievements(request):
    return render(request, 'user_achievements.html')



def user_language(request):
    return render(request, 'language_options.html')

def user_notification(request):
    return render(request, 'notif_preferences.html')

def user_privacy(request):
    return render(request, 'privacy_settings.html')


@role_required("employee")
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


def sign_in(request):
    if request.method == "POST":
        user_type = request.POST.get("user_type")
        email = request.POST.get("email")
        password = request.POST.get("password")
        next_url = request.POST.get("next")  # Get the next URL from the form

        # Авторизация компании
        if user_type == "company":
            company = Company.objects.filter(email=email).first()
            if company and check_password(password, company.password):
                request.session.flush()  # Удаляем предыдущую сессию
                request.session["company_id"] = company.id
                # Redirect to the next URL or default to organizer_profile
                return redirect(next_url or "organizer_profile")
        # Авторизация сотрудника
        elif user_type == "employee":
            employee = Employee.objects.filter(mail=email).first()
            if employee and check_password(password, employee.password):
                if not employee.is_approved:
                    return render(request, "guest.html", {"employee": employee})
                request.session.flush()  # Удаляем предыдущую сессию
                request.session["nickname"] = employee.nickname
                # Redirect to the next URL or default to user_profile
                return redirect(next_url or "user_profile")
        messages.error(request, "Invalid credentials. Please try again.")

    return render(request, "sign_in.html")




#!!!! need to update 

def user_activities(request):
    return render(request, 'user_activities.html')

def activity_details(request):
    return render(request, 'activity_details.html')

