// tRPCエンドポイントテストスクリプト
const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000';

async function testDepartmentsEndpoint() {
  try {
    console.log('Testing /api/trpc/project.getAllDepartments...');
    const response = await fetch(`${baseUrl}/api/trpc/project.getAllDepartments`);
    const data = await response.json();
    console.log('Departments count:', data.result?.data?.length || 0);
    console.log('Sample department:', data.result?.data?.[0]);
  } catch (error) {
    console.error('Error testing departments endpoint:', error.message);
  }
}

async function testUsersEndpoint() {
  try {
    console.log('Testing /api/trpc/project.getAllUsers...');
    const response = await fetch(`${baseUrl}/api/trpc/project.getAllUsers`);
    const data = await response.json();
    console.log('Users count:', data.result?.data?.length || 0);
    console.log('Sample user:', data.result?.data?.[0]);
  } catch (error) {
    console.error('Error testing users endpoint:', error.message);
  }
}

async function main() {
  console.log('Testing tRPC endpoints...');
  await testDepartmentsEndpoint();
  console.log('');
  await testUsersEndpoint();
  console.log('Test completed.');
}

main();

