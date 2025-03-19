from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ADMIN = 'admin'
    NORMAL_USER = 'user'
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (NORMAL_USER, 'User'),
    ]
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default=NORMAL_USER)

    def __str__(self):
        return f"{self.username} ({self.role})"
