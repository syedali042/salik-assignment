from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from accounts.permissions import IsAdminRole  # Ensure this exists

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Project.objects.none()

        if user.role == 'admin':
            # Admins see all projects
            return Project.objects.all()
        else:
            # Normal users see only projects assigned to them
            return Project.objects.filter(assigned_users=user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only Admins can create, update, or delete projects
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return super().get_permissions()

    def perform_create(self, serializer):
        # Admin creates a project, automatically setting themselves as admin
        serializer.save(admin=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        DELETE /api/projects/{id}/ - Deletes a project (Admin Only)
        """
        project = get_object_or_404(Project, pk=kwargs["pk"])
        if request.user.role != 'admin':
            return Response({"detail": "You do not have permission to delete this project."}, status=status.HTTP_403_FORBIDDEN)

        project.delete()
        return Response({"message": "Project deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Task.objects.none()

        if user.role == 'admin':
            # Admins see all tasks
            return Task.objects.all()
        else:
            # Normal users see only tasks assigned to them
            return Task.objects.filter(project__assigned_users=user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'partial_update']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['create', 'update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return super().get_permissions()

    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if project.admin != self.request.user:
            raise PermissionDenied("You are not the admin of this project.")
        serializer.save()

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        user = request.user

        # Admins can do full updates
        if user.role == 'admin':
            return super().update(request, *args, **kwargs)

        # Normal users can only update 'status'
        if user not in task.project.assigned_users.all():
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure only 'status' is updated
        if 'status' not in request.data or len(request.data.keys()) > 1:
            return Response({"detail": "You can only update the status field."}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        DELETE /api/tasks/{id}/ - Deletes a task (Admin Only)
        """
        task = get_object_or_404(Task, pk=kwargs["pk"])

        if request.user.role != 'admin':
            return Response({"detail": "You do not have permission to delete this task."}, status=status.HTTP_403_FORBIDDEN)

        task.delete()
        return Response({"message": "Task deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
