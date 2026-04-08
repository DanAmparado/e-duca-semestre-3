document.addEventListener('DOMContentLoaded', function() {
    // Toggle status
    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('btn-toggle-status')) {
            const button = e.target;
            const id = button.dataset.id;
            const currentStatus = button.dataset.status === 'true';
            const action = currentStatus ? 'desativar' : 'ativar';
            
            if (!confirm(`Tem certeza que deseja ${action} este recurso?`)) return;
            
            try {
                const response = await fetch(`/admin/recursos/${id}/toggle`, { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    // Atualiza o texto do botão e o dataset
                    button.textContent = data.novoStatus ? 'Desativar' : 'Ativar';
                    button.dataset.status = data.novoStatus;
                    // Atualiza o badge de status na tabela
                    const statusCell = button.closest('tr').querySelector('td:nth-child(5)');
                    statusCell.innerHTML = data.novoStatus 
                        ? '<span class="badge bg-success">Ativo</span>' 
                        : '<span class="badge bg-danger">Inativo</span>';
                } else {
                    alert(data.error || 'Erro ao alterar status');
                }
            } catch (err) {
                console.error(err);
                alert('Erro de conexão');
            }
        }
        
        // Excluir recurso
        if (e.target.classList.contains('btn-excluir')) {
            const id = e.target.dataset.id;
            if (!confirm('Excluir este recurso permanentemente? Esta ação não pode ser desfeita.')) return;
            
            try {
                const response = await fetch(`/admin/recursos/excluir/${id}`, { method: 'DELETE' });
                const data = await response.json();
                if (data.success) {
                    // Remove a linha da tabela
                    e.target.closest('tr').remove();
                } else {
                    alert(data.error || 'Erro ao excluir');
                }
            } catch (err) {
                console.error(err);
                alert('Erro de conexão');
            }
        }
    });
});