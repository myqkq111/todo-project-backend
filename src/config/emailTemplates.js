export const generateTemporaryPasswordEmail = (temporaryPassword) => {
  return `
        <p>임시 비밀번호는 <strong>${temporaryPassword}</strong> 입니다.</p>
        <p>로그인 후 비밀번호를 변경해주세요.</p>
      `;
};
