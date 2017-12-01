const expect = require('expect')

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Chris',
      room: 'Node Course'
    }]
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Chris',
      room: 'Test'
    };

    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
    expect(resUser).toMatchObject(user);
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Chris']);
  });
  it('should return names for react course', () => {
    var userList = users.getUserList('React Course');
    expect(userList).toEqual(['Jen']);
  });
  it('should remove a user', () => {
    var user = users.removeUser('1');
    expect(user.id).toEqual('1');
    expect(users.users.length).toEqual(2);
  });
  it('should not remove user', () => {
    var user = users.removeUser('123');
    expect(user).toBeFalsy();
    expect(users.users.length).toEqual(3);
  });
  it('should find user', () => {
    var user = users.getUser('2');
    expect(user).toMatchObject(users.users[1]);
  });
  it('should not find user', () => {
    var user = users.getUser('44');
    expect(user).toBeFalsy();
  });
});
