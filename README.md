# 📝 계획 관리 시스템 (TodoList)

![작게](https://github.com/myqkq111/todo-project-backend/assets/169429248/9eae1bd4-9fe3-4cdd-9fc8-95e800ed50da)

### 왜 우리의 To-Do 리스트가 특별한가요?
<p> 캘린더를 사용할 때, 일상과 직장을 함께 관리하다 보면 오히려 복잡해지고 혼란스러워질 수 있습니다. 그래서 저희는 일상과 직장을 각각 구분하여 효율적으로 관리할 수 있는 To-Do 리스트를 구상하게 되었습니다.</p>

### 우리의 목표

<p>저희 To-Do 리스트 웹사이트는 여러분이 일상과 직장 생활을 체계적으로 관리하여 중요한 일을 놓치지 않도록 도와드립니다. 간편하고 직관적인 디자인 덕분에 누구나 쉽게 사용할 수 있습니다.</p>

----

## 📅 일정 2024.06.23 ~ 2024.07.08

### 기능구현

| 구분           | 주기능    | 상세기능                     | 설명                                                                 |
|------------------------------|-----------|------------------------------|----------------------------------------------------------------------|
| 1. 회원가입     | 1.1 SNS 가입 | 1-1-1 사용자ID와 비밀번호 입력   | 해당 홈페이지에 회원가입을 하려는 사용자ID와 비밀번호를 저장하여 다음 로그인 시 접속 |
| 2. 로그인       | 2.1 로그인 | 2-1-1 로그인 상태 유지        | 홈페이지에 재접속시 로그인을 다시 할 필요없이 일정시간 유지하게 해주는 기능          |
|                | 2.2 로그아웃 | 2-2-1 로그아웃 버튼 생성    | 로그아웃 버튼을 클릭 시 해당사이트에서 로그인상태를 해제                             |
|                 | 2.3 회원탈퇴 | 2-3-1 회원탈퇴 버튼 생성    | 회원탈퇴 시 다음 로그인 때 해당유저에게 대한 정보가 없으므로 "존재하지 않는 XX입니다" 라고 설명 |
|                 | 2.4 회원 정보 수정 | 2-4-1 회원 정보 수정 버튼 | 회원 정보를 수정할 수 있는 기능                                                 |
| 3. 일정 관리    | 3.1 일정 등록 | 3-1-1 등록버튼 생성         | 등록버튼을 눌렀을 시 새로운 일정을 추가할 수 있는 기능                            |
|                 | 3.2 일정 수정 | 3-2-1 수정버튼 생성         | 수정버튼을 눌렀을 시 해당 일정내용을 수정할 수 있는 기능                            |
|                 | 3.3 일정 삭제 | 3-3-1 삭제버튼 생성         | 삭제버튼을 눌렀을 시 해당 일정을 삭제할 수 있는 기능                               |
| 4. 검색 기능    | 4.1 날짜 검색 | 4-1-1 달력버튼 생성         | 지정한 날짜 기간 내에 있는 모든 일정을 출력                                    |
|                 | 4.2 키워드 검색 | 4-2-1 특정 키워드 검색    | 키워드만 입력하여 해당 키워드가 포함된 일정을 모두 출력                       |
| 5. 목록 분류    | 5.1 직장     | 5-1-1 드롭다운으로 선택     | 직장일 스케줄만 조회 가능 기능                                              |
|                 | 5.2 일상     | 5-2-1 드롭다운으로 선택     | 일상일 스케줄만 조회 가능 기능                                              |
|                 | 5.3 전체     | 5-3-1 드롭다운으로 선택     | 모든 스케줄 보기                                                        |
| 6. 필터 기능    | 6.1 미완료   | 6-1-1 미완료 탭 생성         | 미완료의 스케줄만 조회 가능한 기능                                           |
|                 | 6.2 주기적인 일 | 6-2-1 주기적인 일 탭 생성 | 주기적으로 반복 되는 스케줄 조회 기능                                    |
|                 | 6.3 중요     | 6-3-1 중요 탭 생성          | 중요 표시된 스케줄 조회 기능                                             |
|                 | 6.4 완료     | 6-4-1 완료 탭 생성          | 완료된 스케줄 조회 기능                                                   |






<ul>
  <li>06.21 첫 계획 : <a href="https://github.com/user-attachments/files/16140742/6.21.pptx">6.21 계획서.pptx</a></li>
  <li>06.24 계획 구체화 : <a href="https://github.com/user-attachments/files/16140820/06.24.pptx">06.24 계획서.pptx</a></li>
  <li>06.26 수정된 디자인 : <a href="https://github.com/user-attachments/files/16157512/06.26.pptx">06.26 수정된 디자인.pptx</a></li>
  <li>06.27 수정된 계획 : <a href="https://github.com/user-attachments/files/16157807/06.27.pptx">06.27 수정된 계획.pptx</a></li>
</ul>



----

## ⭐ 주요기능
<div style="display: flex; flex-wrap: wrap; justify-content: flex-start;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/b0a81793-e6fd-4b36-847f-1be79e7e382c" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/f8815263-bb16-4063-9d2a-af077e8f4a10" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/642f6a9f-06d5-4233-a0b9-68528f57b18b" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/8af79029-d880-4892-a5a4-11044bce0eff" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/f6bce8c9-b022-4699-9a4a-bdb164d7ca05" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/ae5682b8-58e9-44c9-878f-9ff08d5de392" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/b11d132d-147f-48f4-b2ea-0402468cece4" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/3e5d7db8-2624-4ba4-9208-64ad753eb4dd" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/78733d0e-fda1-469e-80df-dfd4e797f52f" alt="기능 이미지" style="width: 48%; margin: 1%;">
  <img src="https://github.com/myqkq111/todo-project-backend/assets/169429248/5993f801-7aed-459e-8bec-f8332418c22b" alt="기능 이미지" style="width: 48%; margin: 1%;">
</div>


----


## 🛠️ Tech Stacks

<div style="display: flex; flex-wrap: wrap;">
  <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white" alt="Amazon S3" style="margin-right: 10px; margin-bottom: 10px;">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white" alt="Git" style="margin-right: 10px; margin-bottom: 10px;">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white" alt="Tailwind CSS" style="margin-right: 10px; margin-bottom: 10px;">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white" alt="React" style="margin-right: 10px; margin-bottom: 10px;">
  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white" alt="Javascript" style="margin-right: 10px; margin-bottom: 10px;">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white" alt="MongoDB" style="margin-right: 10px; margin-bottom: 10px;">
</div>


----


## 😥 아쉬운 부분

<ul>
  <li>직장과 일상 만이 아닌 + 큰 카테고리를 추가하여 더 다양한 일정관리 서비스</li>
  <li>일정을 ex) 07.08 - 07.17로 기간으로 추가하고 메인화면에서도 같은 기간은 이어진 줄로 보여지는 서비스</li>
  <li>스마트폰이나 이메일로 알람 서비스</li>
</ul>


----


## 팀원

<ul>
  <li>최준서</li>
  <li>이명준</li>
  <li>박승연</li>
  <li>박진희</li>
</ul>

----

## ✒ 프로젝트 회고

<ul>
  <li>최준서 👑</li>
  ㅇㅇ
  <li>이명준</li>
  <li>박승연</li>
  <li>박진희</li>
</ul>
