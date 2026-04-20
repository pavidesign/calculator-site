// 계산 함수
function calculate() {
    // 입력값 가져오기
    const productValue = document.getElementById('product').value;
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);

    // 유효성 검사
    if (!productValue) {
        showError('제품을 선택해주세요');
        return;
    }

    if (!width || width <= 0 || width > 5000) {
        showError('올바른 가로 값을 입력해주세요 (1~5000cm)');
        return;
    }

    if (!height || height <= 0 || height > 5000) {
        showError('올바른 세로 값을 입력해주세요 (1~5000cm)');
        return;
    }

    // 제품 정보 파싱
    const [pricePerCm, productName] = productValue.split('|');
    const price = parseFloat(pricePerCm);

    // 계산
    const area = width * height;
    const totalPrice = Math.round(area * price);
    const quantity = Math.ceil(area / 1000);

    // 결과 저장 (전역 변수)
    window.lastCalculation = {
        product: productName,
        width: width,
        height: height,
        area: area,
        price: price,
        totalPrice: totalPrice,
        quantity: quantity,
        date: new Date().toLocaleString('ko-KR')
    };

    // 결과 표시
    displayResults(productName, area, price, totalPrice, quantity);
    hideError();
    showSuccess('계산이 완료되었습니다!');
}

// 결과 표시 함수
function displayResults(productName, area, price, totalPrice, quantity) {
    document.getElementById('resultProduct').textContent = productName;
    document.getElementById('resultArea').textContent = area.toFixed(2) + ' cm²';
    document.getElementById('resultPrice').textContent = price.toLocaleString('ko-KR') + ' 원/cm²';
    document.getElementById('resultTotal').textContent = totalPrice.toLocaleString('ko-KR') + ' 원';
    document.getElementById('resultQuantity').textContent = quantity + ' 개';

    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 폼 초기화
function resetForm() {
    document.getElementById('calculatorForm').reset();
    document.getElementById('results').classList.add('hidden');
    hideError();
    document.getElementById('product').focus();
}

// 에러 메시지 표시
function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.textContent = '⚠️ ' + message;
    errorDiv.classList.remove('hidden');
    errorDiv.classList.add('show');
}

// 에러 메시지 숨기기
function hideError() {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.classList.add('hidden');
    errorDiv.classList.remove('show');
}

// 성공 메시지 표시
function showSuccess(message) {
    const successDiv = document.getElementById('successMsg');
    successDiv.textContent = '✅ ' + message;
    successDiv.classList.remove('hidden');
    successDiv.classList.add('show');
    setTimeout(() => {
        successDiv.classList.add('hidden');
        successDiv.classList.remove('show');
    }, 3000);
}

// 계산 기록에 저장
function saveToHistory() {
    if (!window.lastCalculation) {
        showError('저장할 계산 결과가 없습니다');
        return;
    }

    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    history.unshift(window.lastCalculation);
    
    // 최대 50개까지만 저장
    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    showSuccess('계산 기록이 저장되었습니다!');
}

// 인쇄
function printResult() {
    if (!window.lastCalculation) {
        showError('인쇄할 결과가 없습니다');
        return;
    }

    const calc = window.lastCalculation;
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write('<html><head><title>계산 결과</title></head><body>');
    printWindow.document.write('<h2>자동 계산기 - 계산 결과</h2>');
    printWindow.document.write('<p><strong>제품명:</strong> ' + calc.product + '</p>');
    printWindow.document.write('<p><strong>가로:</strong> ' + calc.width + 'cm</p>');
    printWindow.document.write('<p><strong>세로:</strong> ' + calc.height + 'cm</p>');
    printWindow.document.write('<p><strong>면적:</strong> ' + calc.area.toFixed(2) + 'cm²</p>');
    printWindow.document.write('<p><strong>단가:</strong> ' + calc.price.toLocaleString('ko-KR') + '원/cm²</p>');
    printWindow.document.write('<p><strong>총 금액:</strong> ' + calc.totalPrice.toLocaleString('ko-KR') + '원</p>');
    printWindow.document.write('<p><strong>수량:</strong> ' + calc.quantity + '개</p>');
    printWindow.document.write('<p><strong>날짜:</strong> ' + calc.date + '</p>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// FAQ 토글
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allQuestions = document.querySelectorAll('.faq-question');

    // 다른 열려있는 항목 닫기
    allAnswers.forEach(a => {
        if (a !== answer) {
            a.classList.remove('show');
        }
    });

    allQuestions.forEach(q => {
        if (q !== button) {
            q.classList.remove('active');
        }
    });

    // 현재 항목 토글
    answer.classList.toggle('show');
    button.classList.toggle('active');
}

// 엔터키로 계산
document.addEventListener('DOMContentLoaded', function() {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    if (widthInput) {
        widthInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculate();
        });
    }

    if (heightInput) {
        heightInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculate();
        });
    }
});
