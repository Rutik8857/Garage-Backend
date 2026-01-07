(async ()=>{
  try{
    const ctrl = require('./controllers/userController');
    const req = { body: { name: 'Dbg3', email: 'dbg3@example.com', mobile_number: '9222222222', password: 'Pass1234', confirmPassword: 'Pass1234' } };
    const res = {
      status(s) { return { json: (o) => console.log('RES', s, o), send: () => console.log('RES', s, 'send') }; }
    };

    await ctrl.createUser(req, res);
  } catch(e) {
    console.error('CALLERR', e);
  }
})();
