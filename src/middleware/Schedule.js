import schedule from 'node-schedule';
import Todo from '../models/Todo.js';

// 매일 자정에 실행할 스케줄링 작업 설정
function Schedule() {
  const cronExpression = '0 0 * * *'; // 매일 자정(0시 0분)에 실행
  schedule.scheduleJob(cronExpression, async () => {
    try {
      // 특정 조건에 맞는 데이터 필드 값을 업데이트
      const today = new Date();
      today.setDate(today.getDate() - 1); // 현재 날짜에 하루를 뺀다

      // 오늘 자정 시간 설정
      const startOfToday = new Date(today);
      startOfToday.setHours(0, 0, 0, 0); // 오늘 자정으로 설정

      // 오늘 마지막 시간 설정
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999); // 오늘 23:59:59.999로 설정

      const query = {
        dueDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }; // 오늘 날짜와 일치하는 데이터를 찾음

      const update = { $set: { failedSchedule: true, isImportant: false } }; // 업데이트할 필드 값

      // MongoDB 업데이트 쿼리
      const todo = await Todo.updateMany(query, update);
      console.log('데이터 업데이트 완료:', todo);
    } catch (error) {
      console.error('데이터 업데이트 실패:', error);
    }
  });
}

export default Schedule;
