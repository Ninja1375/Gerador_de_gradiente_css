// Elementos do DOM
const colorOne = document.getElementById('color_one');
const colorTwo = document.getElementById('color_two');
const cssCode = document.getElementById('css-code');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');
const gradientPreview = document.getElementById('gradient-preview');
const directionButtons = document.querySelectorAll('.direction-btn');

// Estado da aplicação
let currentDirection = "to top";
let isCopied = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Gerar gradiente inicial
    generateGradient();
    
    // Event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Event listeners para mudanças de cor
    colorOne.addEventListener('input', generateGradient);
    colorTwo.addEventListener('input', generateGradient);
    
    // Event listener para o botão de copiar
    copyBtn.addEventListener('click', copyCode);
    
    // Event listener para tecla Enter no textarea
    cssCode.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            copyCode();
        }
    });
    
    // Event listener para mudanças no textarea (backup)
    cssCode.addEventListener('input', function() {
        updateGradientFromCode();
    });
}

function setDirection(value, clickedButton) {
    // Remove a classe active de todos os botões
    directionButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Adiciona a classe active ao botão clicado
    clickedButton.classList.add('active');
    currentDirection = value;
    
    // Gera o gradiente automaticamente
    generateGradient();
}

function generateGradient() {
    const color1 = colorOne.value;
    const color2 = colorTwo.value;
    
    // Cria o código CSS do gradiente
    const gradientCode = `background: linear-gradient(${currentDirection}, ${color1}, ${color2});`;
    
    // Atualiza o textarea
    cssCode.value = gradientCode;
    
    // Aplica o gradiente ao preview
    gradientPreview.style.background = `linear-gradient(${currentDirection}, ${color1}, ${color2})`;
    
    // Aplica o gradiente ao body
    document.body.style.background = `linear-gradient(${currentDirection}, ${color1}, ${color2})`;
    
    // Reset do estado de cópia se o código mudar
    if (isCopied) {
        resetCopyButton();
    }
}

function updateGradientFromCode() {
    try {
        const cssValue = cssCode.value.trim();
        
        // Extrai a direção e cores do código CSS
        const gradientMatch = cssValue.match(/linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
        
        if (gradientMatch) {
            const direction = gradientMatch[1].trim();
            const color1 = gradientMatch[2].trim();
            const color2 = gradientMatch[3].trim();
            
            // Atualiza os inputs de cor
            colorOne.value = color1;
            colorTwo.value = color2;
            
            // Atualiza a direção e botões ativos
            updateDirectionButtons(direction);
            
            // Aplica o gradiente
            gradientPreview.style.background = cssValue.replace('background:', '').trim();
            document.body.style.background = cssValue.replace('background:', '').trim();
        }
    } catch (error) {
        console.warn('Não foi possível atualizar o gradiente a partir do código:', error);
    }
}

function updateDirectionButtons(direction) {
    directionButtons.forEach(button => {
        button.classList.remove('active');
        
        // Encontra o botão correspondente à direção
        const buttonDirection = getDirectionFromButton(button);
        if (buttonDirection === direction) {
            button.classList.add('active');
            currentDirection = direction;
        }
    });
}

function getDirectionFromButton(button) {
    const icon = button.querySelector('i');
    if (!icon) return '';
    
    const classes = Array.from(icon.classList);
    
    if (classes.includes('fa-arrow-up') && !icon.style.transform) return 'to top';
    if (classes.includes('fa-arrow-down') && !icon.style.transform) return 'to bottom';
    if (classes.includes('fa-arrow-left') && !icon.style.transform) return 'to left';
    if (classes.includes('fa-arrow-right') && !icon.style.transform) return 'to right';
    if (classes.includes('fa-arrow-up') && icon.style.transform.includes('45deg')) return 'to top right';
    if (classes.includes('fa-arrow-down') && icon.style.transform.includes('45deg')) return 'to bottom left';
    if (classes.includes('fa-arrow-left') && icon.style.transform.includes('45deg')) return 'to top left';
    if (classes.includes('fa-arrow-right') && icon.style.transform.includes('45deg')) return 'to bottom right';
    
    return '';
}

async function copyCode(event) {
    if (event) {
        event.preventDefault();
    }
    
    try {
        // Seleciona e copia o texto
        cssCode.select();
        cssCode.setSelectionRange(0, 99999); // Para mobile
        
        // Usa a Clipboard API moderna
        await navigator.clipboard.writeText(cssCode.value);
        
        // Feedback visual
        showCopySuccess();
        
    } catch (error) {
        // Fallback para métodos antigos
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch (fallbackError) {
            showCopyError();
            console.error('Falha ao copiar texto:', fallbackError);
        }
    }
}

function showCopySuccess() {
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    copyBtn.classList.add('copied');
    isCopied = true;
    
    // Restaura o botão após 2 segundos
    setTimeout(resetCopyButton, 2000);
}

function showCopyError() {
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-times"></i> Erro!';
    copyBtn.style.background = '#ff4444';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

function resetCopyButton() {
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    copyBtn.classList.remove('copied');
    isCopied = false;
}

// Exportar funções para uso global (se necessário)
window.setDirection = setDirection;
window.generateGradient = generateGradient;
window.copyCode = copyCode;

// Debug helper (remover em produção)
if (console && typeof console.debug === 'function') {
    console.debug('Gerador de Gradiente inicializado');
}