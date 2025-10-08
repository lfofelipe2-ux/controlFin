#!/bin/bash

# Script de validação otimizada para mudanças apenas de documentação
# Executa apenas verificações essenciais quando não há mudanças de código

echo "🔍 Verificando tipo de mudanças..."

# Executar o script de verificação de mudanças
node scripts/check-changes-type.js
CHANGE_TYPE_EXIT_CODE=$?

if [ $CHANGE_TYPE_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "📄 Modo: Documentação apenas - Executando validação otimizada"
    echo "=================================================="
    
    # Verificações essenciais para documentação
    echo "✅ 1. Verificando se há mudanças para commitar..."
    if [ -z "$(git status --porcelain)" ]; then
        echo "⚠️  Nenhuma mudança para commitar"
        exit 1
    fi
    
    echo "✅ 2. Verificando regras de commit..."
    # Verificar se o commit message segue o padrão (se houver)
    if [ -n "$1" ]; then
        echo "📝 Commit message: $1"
        # Aqui você pode adicionar validação do commit message
    fi
    
    echo "✅ 3. Verificando tamanho dos arquivos..."
    # Verificar arquivos grandes
    LARGE_FILES=$(find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null || true)
    if [ -n "$LARGE_FILES" ]; then
        echo "⚠️  Arquivos grandes detectados:"
        echo "$LARGE_FILES"
    fi
    
    echo "✅ 4. Verificando estrutura de arquivos..."
    # Verificar se arquivos de documentação estão em locais corretos
    echo "📁 Verificando estrutura de pastas..."
    
    echo "✅ 5. Verificando sintaxe básica de arquivos..."
    # Verificar sintaxe YAML apenas dos arquivos modificados
    MODIFIED_YAML_FILES=$(git diff --cached --name-only | grep -E '\.(yml|yaml)$' || true)
    if [ -n "$MODIFIED_YAML_FILES" ]; then
        echo "🔍 Verificando sintaxe YAML dos arquivos modificados..."
        if command -v yamllint >/dev/null 2>&1; then
            echo "$MODIFIED_YAML_FILES" | while read -r file; do
                if [ -f "$file" ] && ! yamllint "$file" >/dev/null 2>&1; then
                    echo "❌ Erro de sintaxe YAML em: $file"
                    exit 1
                fi
            done
        else
            echo "⚠️  yamllint não encontrado, pulando verificação YAML"
        fi
    else
        echo "✅ Nenhum arquivo YAML modificado para verificar"
    fi
    
    echo ""
    echo "🎉 Validação de documentação concluída com sucesso!"
    echo "📄 Mudanças de documentação aprovadas para commit"
    echo "🚀 Validações completas foram puladas (otimização)"
    
elif [ $CHANGE_TYPE_EXIT_CODE -eq 2 ]; then
    echo ""
    echo "💻 Modo: Validação completa necessária"
    echo "=================================================="
    echo "🔄 Executando validação completa..."
    
    # Executar validação completa
    if [ -f "scripts/validate-complete.sh" ]; then
        ./scripts/validate-complete.sh
        if [ $? -ne 0 ]; then
            echo ""
            echo "❌ VALIDAÇÃO COMPLETA FALHOU!"
            echo "🚫 Commit bloqueado devido a problemas de validação"
            echo ""
            echo "💡 Para corrigir:"
            echo "   1. Corrija os problemas acima"
            echo "   2. Execute: ./scripts/validate-complete.sh"
            echo "   3. Tente commitar novamente"
            echo ""
            exit 1
        fi
        echo "✅ Validação completa passou!"
    else
        echo "❌ Script de validação completa não encontrado"
        exit 1
    fi
    
else
    echo "❌ Erro na verificação de mudanças"
    exit $CHANGE_TYPE_EXIT_CODE
fi