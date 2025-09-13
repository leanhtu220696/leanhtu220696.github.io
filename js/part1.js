!function () {
    const supabaseUrl = 'https://weparqswcunvmlmrgwwl.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlcGFycXN3Y3Vudm1sbXJnd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDA2MzMsImV4cCI6MjA2MjcxNjYzM30.hgOew0VHZhxZjLOJVnuiDOII6EeurlqSNvYkNzd2SFc';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    let score = 0;
    let count = 0;
    let data = [];
    let result = "";
    const maxScore = 60; // tổng điểm
    const circle = document.querySelector('.progress');
    const scoreText = document.getElementById('score');
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    function setProgress(score) {
        const offset = circumference - (score / maxScore) * circumference;
        circle.style.strokeDashoffset = offset;
        scoreText.textContent = `${score}/${maxScore}`;
    }

    circle.style.strokeDasharray = circumference;
    setProgress(score);
    async function fetchDataPart1() {
        const { data, error } = await supabase
            .from('part1')
            .select('*');
        
        if (error) {
            console.error('Lỗi khi lấy dữ liệu document:', error);
            return [];
        }
        return data || [];
    }
    function getRandomWords(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
    }
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function getRandomItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function onClick(value) {
        if(value == result){
            score++;
            count++;
            const btnAnswerDiv = document.getElementById('btn-answer');
            const buttons = btnAnswerDiv.querySelectorAll('button');
            buttons.forEach(btn => btn.remove());
            setNewQuestion();
            setCountQuestion();
            setProgress(score);
            if(count == maxScore+1){
                window.location.href='index.html'
            }
        }else{
            const buttons = document.querySelectorAll('#btn-answer button');
            buttons.forEach((btn) => {
                if(btn.textContent == value){
                    btn.style="background-color: #e80e0e; color: #fff";
                };
            });
        }
    }
    function setAnswer(name){
        const body = document.querySelector('.btn-answer')
        const btn = document.createElement('button');
            btn.className = 'btn col-sm-4 col-md-12';
            btn.onclick = function () {
                onClick(name);
            };
            btn.textContent = `${name}`;     
        if ($(body).data('owl.btn-answer')) {
            $(body).trigger('add.owl.btn-answer', [btn]).trigger('refresh.owl.btn-answer');
        } else {
            body.appendChild(btn);
        }
    }
    function setCountQuestion() {
        const body = document.querySelector('.count-question');
        let questionText = body.querySelector('h6');
        if (!questionText) {
            questionText = document.createElement('h6');
            questionText.style = "text-align: left; font-size: 12px;";
            body.append(questionText);
        }
        questionText.textContent = `Question ${count} of 60`;
    }
    function setDesQuestion(des) {
        const body = document.querySelector('.des-question');
        let questionText = body.querySelector('h6');
        if (!questionText) {
            questionText = document.createElement('h6');
            questionText.style = "text-align: left; font-size: 14px;";
            body.append(questionText);
        }
        questionText.textContent = `${des}`;
    }

    function setNewQuestion(){
        const answersData = data.map(item => item.answer.trim());
        const randomItem = getRandomItem(data); 
        result=randomItem.answer;
        const random3 = getRandomWords(answersData, 3);
        random3.push(result);
        let shuffled3 = shuffleArray(random3);
        shuffled3.map(item => setAnswer(item));
        setDesQuestion(randomItem.question);
    }
    document.addEventListener('DOMContentLoaded', async function () {
           try {
            const [part1] = await Promise.all([
                fetchDataPart1(),
            ]);
            data = part1;
            setNewQuestion()
            setCountQuestion();
            
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    });
}();
