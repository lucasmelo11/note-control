from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Notebook, Emprestimo
from .serializers import NotebookSerializer, EmprestimoSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings

class NotebookViewSet(viewsets.ModelViewSet):
    queryset = Notebook.objects.all()
    serializer_class = NotebookSerializer
    filterset_fields = ['situacao', 'marca_modelo', 'numero_patrimonio']
    search_fields = ['marca_modelo', 'numero_patrimonio', 'responsavel']
    ordering_fields = ['created_date', 'updated_date']

class EmprestimoViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer
    filterset_fields = ['status', 'tipo_emprestimo', 'nome_solicitante', 'secretaria']
    search_fields = ['nome_solicitante', 'secretaria', 'evento_descricao']
    ordering_fields = ['data_retirada', 'prazo_devolucao', 'created_date']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['id']

class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'Nenhum arquivo enviado.'}, status=400)
        file_path = default_storage.save(file_obj.name, file_obj)
        return Response({'file_url': request.build_absolute_uri(settings.MEDIA_URL + file_obj.name)})