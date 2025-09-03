from django.db import models
from django.contrib.auth.models import User

class Notebook(models.Model):
    numero_patrimonio = models.CharField(max_length=32, unique=True)
    marca_modelo = models.CharField(max_length=128)
    numero_serie = models.CharField(max_length=64, unique=True)
    responsavel = models.CharField(max_length=128, blank=True)
    situacao = models.CharField(max_length=16, choices=[
        ('disponivel', 'Disponível'),
        ('emprestado', 'Emprestado'),
        ('manutencao', 'Manutenção'),
    ])
    observacoes = models.TextField(blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

class Emprestimo(models.Model):
    notebooks = models.ManyToManyField(Notebook, related_name='emprestimos')
    tipo_emprestimo = models.CharField(max_length=16, choices=[
        ('individual', 'Individual'),
        ('evento', 'Evento'),
    ])
    nome_solicitante = models.CharField(max_length=128)
    secretaria = models.CharField(max_length=128)
    evento_descricao = models.CharField(max_length=128, blank=True)
    data_retirada = models.DateField()
    prazo_devolucao = models.DateField()
    data_devolucao = models.DateField(null=True, blank=True)
    situacao_devolucao = models.CharField(max_length=16, blank=True)
    observacoes_devolucao = models.TextField(blank=True)
    termo_url = models.CharField(max_length=256, blank=True)
    status = models.CharField(max_length=16, choices=[
        ('ativo', 'Ativo'),
        ('devolvido', 'Devolvido'),
    ])
    tecnico_responsavel = models.CharField(max_length=128)
    created_date = models.DateTimeField(auto_now_add=True)