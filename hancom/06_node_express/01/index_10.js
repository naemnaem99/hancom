const AUTH_HEADER = { 'Authorization': 'HANCOM' };

let currentStudents = [];
let draggedId = null;

// 정상 명단 (20명)
const NORMAL_LIST = [
  '강성원', '강하영', '김정아', '김정현', '김해냄', '김효인', '박진', '안치호',
  '양하은', '유민성', '이도연', '이현우', '임소정', '전욱진', '정기준', '정선민',
  '정유진', '표후동', '한유진', '한윤지'
];

// 교실 배치도 — 한 행에 3자리 + 통로 + 3자리, '공석'은 빈자리, null은 통로
const SEAT_LAYOUT = [
  ['공석', '한유진', '한윤지', null, '김정아', '김정현', '공석'],
  ['이도연', '강하영', '정유진', null, '김해냄', '정기준', '표후동'],
  ['정선민', '양하은', '유민성', null, '공석', '전욱진', '이현우'],
  ['공석', '박진', '김효인', null, '강성원', '임소정', '안치호'],
];

// 현재 세션에서 각 자리에 배정된 이름 (추가/삭제에 따라 바뀜) — 최초엔 SEAT_LAYOUT과 동일
let seatAssignments = SEAT_LAYOUT.map(row => [...row]);

// 서버 데이터를 정상 명단과 동기화 (id 값은 신경 쓰지 않고, 이름 기준으로만 맞춤)
// - 정상 명단에 없는 이름 → 삭제
// - 같은 이름이 중복되면 → 하나만 남기고 나머지 삭제
// - 정상 명단에 있는데 없는 이름 → 추가
// 요청은 항상 하나씩 순서대로 보내서 서버의 id 채번 충돌을 피함
async function syncWithNormalList() {
  const res = await fetch('http://192.168.10.28:5000/hancom/김해냄/users', {
    headers: AUTH_HEADER
  });
  const students = await res.json();

  const seenNames = new Set();
  for (const s of students) {
    const isDuplicate = seenNames.has(s.name);
    const isPolluted = !NORMAL_LIST.includes(s.name);
    if (isDuplicate || isPolluted) {
      await fetch(`http://192.168.10.28:5000/hancom/김해냄/users/${s.id}`, {
        method: 'DELETE',
        headers: AUTH_HEADER
      });
    } else {
      seenNames.add(s.name);
    }
  }

  // 삭제 후 실제 서버 상태를 다시 조회 (id가 겹쳐있던 항목은 하나 지우면 둘 다 같이 지워질 수 있어서,
  // 지운 만큼만 빠졌다고 가정하지 않고 실제로 뭐가 남았는지 다시 확인함)
  const res2 = await fetch('http://192.168.10.28:5000/hancom/김해냄/users', {
    headers: AUTH_HEADER
  });
  const remaining = await res2.json();
  const remainingNames = new Set(remaining.map(s => s.name));

  const toAdd = NORMAL_LIST.filter(name => !remainingNames.has(name));
  for (const name of toAdd) {
    await fetch('http://192.168.10.28:5000/hancom/김해냄/users', {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  }

  loadStudents();
}

function loadStudents() {
  
  fetch('http://192.168.10.28:5000/hancom/김해냄/users', {
    headers: { 'Authorization': 'HANCOM' }
  })
    .then(res => res.json())
    .then(students => {
      console.log(students)
      
      renderStudents(students);
    })
}

function renderStudents(students) {
  currentStudents = students;
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  seatAssignments.forEach((row, r) => {
    row.forEach((seat, c) => {
      if (seat === null) {
        // 통로 — 빈 칸
        grid.appendChild(document.createElement('div'));
        return;
      }

      // 서버에서 사라진 이름(삭제됨)이면 자동으로 공석 처리
      if (seat !== '공석' && !students.find(st => st.name === seat)) {
        seatAssignments[r][c] = '공석';
        seat = '공석';
      }

      if (seat === '공석') {
        const div = document.createElement('div');
        div.className = 'vacant';
        div.textContent = '공석';
        div.onclick = () => addStudentAt(r, c);
        grid.appendChild(div);
        return;
      }

      const s = students.find(st => st.name === seat);
      const div = document.createElement('div');
      div.className = 'student';
      div.textContent = seat;
      div.draggable = true;
      div.dataset.id = s.id;
      div.onclick = () => editStudent(s.id, s.name, r, c);

      div.ondragstart = () => {
        draggedId = s.id;
      };

      const delBtn = document.createElement('span');
      delBtn.className = 'delete-btn';
      delBtn.textContent = '✕';
      delBtn.onclick = (e) => {
        e.stopPropagation(); // 삭제 버튼 클릭 시 editStudent 실행 방지
        deleteStudent(s.id, r, c);
      };
      div.appendChild(delBtn);

      grid.appendChild(div);
    });
  });
}

// 공석 클릭 → 새 학생 이름 입력 → POST로 추가하고 그 자리에 배정
function addStudentAt(r, c) {
  const name = prompt('추가할 학생 이름을 입력하세요');
  if (!name) return;

  fetch('http://192.168.10.28:5000/hancom/김해냄/users', {
    method: 'POST',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(() => {
      seatAssignments[r][c] = name;
      loadStudents();
    });
}

// 드롭이 끝나면 실제 DOM 순서를 읽어서 currentStudents에 반영 (화면 표시 순서만 변경, 서버 데이터는 그대로)
function finalizeOrder() {
  const grid = document.getElementById('grid');
  const idOrder = Array.from(grid.children)
    .map(el => el.dataset.id)
    .filter(id => id !== undefined)
    .map(Number);
  const rest = currentStudents.filter(s => !idOrder.includes(s.id));
  currentStudents = [...idOrder.map(id => currentStudents.find(s => s.id === id)), ...rest];
  draggedId = null;
}

// 이름 클릭 → prompt로 새 이름 입력 → PUT으로 수정
function editStudent(id, oldName, r, c) {
  const newName = prompt('새 이름을 입력하세요', oldName);
  if (!newName || newName === oldName) return;

  fetch(`http://192.168.10.28:5000/hancom/김해냄/users/${id}`, {
    method: 'PUT',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName })
  })
    .then(res => res.json())
    .then(() => {
      seatAssignments[r][c] = newName;
      loadStudents();
    });
}

// 학생 삭제 — DELETE (삭제되면 그 자리는 공석으로 표시)
function deleteStudent(id, r, c) {
  fetch(`http://192.168.10.28:5000/hancom/김해냄/users/${id}`, {
    method: 'DELETE',
    headers: AUTH_HEADER
  })
    .then(res => res.json())
    .then(() => {
      seatAssignments[r][c] = '공석';
      loadStudents();
    });
}

syncWithNormalList();
