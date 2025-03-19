from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Project
from django.contrib.auth import get_user_model



User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 
            'project', 'created_at', 'updated_at'
        ]



User = get_user_model()

class ProjectSerializer(serializers.ModelSerializer):
    # We can allow admin to pick any user with role='user'
    # assigned_user = serializers.PrimaryKeyRelatedField(
    #     queryset=User.objects.filter(role='user'),  # or all users if you prefer
    #     required=False,
    #     allow_null=True
    # )

    assigned_users = serializers.PrimaryKeyRelatedField(
        many=True,
        # queryset=User.objects.filter(role='user'),
        queryset=User.objects.filter(role='user'),
        required=False
    )


    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'admin', 'assigned_users', 'created_at']
        read_only_fields = ['admin', 'created_at']

    def create(self, validated_data):
        validated_data['admin'] = self.context['request'].user
        return super().create(validated_data)

