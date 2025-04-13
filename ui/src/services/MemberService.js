import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

class MemberService {
  getAllMembers() {
    return api.get('/members');
  }

  getMemberById(id) {
    return api.get(`/members/${id}`);
  }

  createMember(member) {
    return api.post('/members', member);
  }

  updateMember(id, member) {
    return api.put(`/members/${id}`, member);
  }

  deleteMember(id) {
    return api.delete(`/members/${id}`);
  }
}

// Create an instance and export it
const memberService = new MemberService();
export default memberService;
