!function () {
    const supabaseUrl = 'https://weparqswcunvmlmrgwwl.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlcGFycXN3Y3Vudm1sbXJnd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDA2MzMsImV4cCI6MjA2MjcxNjYzM30.hgOew0VHZhxZjLOJVnuiDOII6EeurlqSNvYkNzd2SFc';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    let score = 0;
    let count = 0;
    let data = [];
    let result = "";
    const maxScore = 30; // tổng điểm
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
            .from('part5')
            .select('*');
        if (error) {
            console.error('Lỗi khi lấy dữ liệu document:', error);
            return [];
        }
        return data || [];
    }
    
    function getRandomItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function setCountQuestion() {
        const body = document.querySelector('.count-question');
        let questionText = body.querySelector('h6');
        if (!questionText) {
            questionText = document.createElement('h6');
            questionText.style = "text-align: left; font-size: 12px;";
            body.append(questionText);
        }
        questionText.textContent = `Question ${count} of ${maxScore}`;
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
        let count112= 0;
        count112++;
        console.log(count112, count112);
        const randomItem = getRandomItem(data); 
        setDesQuestion(randomItem.question);
        result=randomItem.answer;
    }
    function handleSubmit(event) {
        event.preventDefault();
        const text = document.getElementById("myText").value;
        if(compareSentences(result, text) == "true"){
            score++;
            setProgress(score);
        }else{
            document.getElementById("result").innerHTML = compareSentences(result, text);
            event.target.style.display = "none";
            document.getElementById("editBtn").style.display = "inline-block";
            document.getElementById("nextBtn").style.display = "inline-block";
        }
    }

    function editAnswer() {
        const form = document.querySelector('.des-answers form');
        form.style.display = "block";
        document.getElementById("editBtn").style.display = "none";
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("result").innerText = "";
    }

    function clearAnswers() {
        const answersDiv = document.querySelector('.answers');
        if (answersDiv) {
            answersDiv.innerHTML = "";
        }
    }
    function nextQuestion() {
        count++;
        setNewQuestion();
        setCountQuestion();
        clearAnswers();
        setAnswer();
        if(count == maxScore+1){
            window.location.href='index.html'
        }
    }

    function setAnswer() {
        const body = document.querySelector('.answers');
        const wrapper = document.createElement('div');
        wrapper.className = 'des-answers';

        const title = document.createElement('h6');
        title.style= "text-align: left; font-size: 12px;";
        title.textContent = "Answer: ";
        wrapper.appendChild(title);

        const form = document.createElement('form');
        form.addEventListener("submit", handleSubmit);

        const textarea = document.createElement('textarea');
        textarea.id = "myText";
        textarea.placeholder = "Nhập đoạn văn tại đây...";
        form.appendChild(textarea);

        form.appendChild(document.createElement("br"));

        const button = document.createElement('button');
        button.type = "submit";
        button.style='float: inline-end; font-size: 14px;';
        button.className = "btn btn-primary"
        button.textContent = "Submit";
        form.appendChild(button);

        wrapper.appendChild(form);

        const resultDiv = document.createElement('div');
        resultDiv.id = "result";
        resultDiv.style.marginTop = "10px";
        wrapper.appendChild(resultDiv);

        const div = document.createElement('div');
        div.style = "display: flex; justify-content: space-evenly;";

        const editBtn = document.createElement('button');
        editBtn.id = "editBtn";
        editBtn.className = "btn"
        editBtn.textContent = "Sửa";
        editBtn.style="display: none; font-size: 14px;";
        editBtn.onclick = editAnswer;
        div.appendChild(editBtn);

        const nextBtn = document.createElement('button');
        nextBtn.id = "nextBtn";
        nextBtn.className = "btn btn-primary"
        nextBtn.textContent = "Next";
        nextBtn.style = "display: none; font-size: 14px;";
        nextBtn.onclick = nextQuestion;
        div.appendChild(nextBtn);

        wrapper.appendChild(div);

        body.appendChild(wrapper);
    }
   function compareSentences(correct, user) {
        if (correct.trim() === user.trim()) {
            return correct;
        }

        const correctWords = correct.trim().split(/\s+/);
        const userWords = user.trim().split(/\s+/);

        let resultNew = "";
        let i = 0, j = 0;

        while (i < correctWords.length || j < userWords.length) {
            if (i < correctWords.length && j < userWords.length) {
                if (correctWords[i] === userWords[j]) {
                    // đúng chữ
                    resultNew += correctWords[i] + " ";
                    i++; j++;
                } else {
                    resultNew += `<span style="color:red">${userWords[j]}</span> `;
                    resultNew += `<span style="color:green">${correctWords[i]}</span> `;
                    i++; j++;
                }
            } else if (i < correctWords.length) {
                resultNew += `<span style="color:green">${correctWords[i]}</span> `;
                i++;
            } else if (j < userWords.length) {
                resultNew += `<span style="color:red">${userWords[j]}</span> `;
                j++;
            }
        }

        return resultNew.trim();
    }

    document.addEventListener('DOMContentLoaded', async function () {
           try {
            const [part1] = await Promise.all([
                fetchDataPart1(),
            ]);
            data = part1;
            setNewQuestion()
            setCountQuestion();
            setAnswer();
            
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    });      
}();