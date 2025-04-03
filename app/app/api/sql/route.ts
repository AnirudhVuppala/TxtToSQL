import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { Sequelize } = await import('sequelize');
  const pg = await import('pg'); // Fixed missing "="

  // Initialize Sequelize connection
  const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5431,
    dialect: 'postgres',
    dialectModule: pg, // Ensure pg is correctly passed
  });

  try {
    const { query } = await req.json(); // Extract query from request body

    const [results] = await sequelize.query(query); // Execute query safely

    return NextResponse.json({ results }); // Return results in JSON
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ error: 'Error executing query' }, { status: 500 });
  } finally {
    await sequelize.close(); // Close connection after execution
  }
}
