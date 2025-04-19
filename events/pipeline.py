def save_profile(backend, user, response, *args, **kwargs):
    if backend.name == 'google-oauth2':
        user.email = response.get('email')
        user.social_id = response.get('id')
        user.social_provider = 'google'
    elif backend.name == 'facebook':
        user.email = response.get('email')
        user.social_id = response.get('id')
        user.social_provider = 'facebook'
    user.save()