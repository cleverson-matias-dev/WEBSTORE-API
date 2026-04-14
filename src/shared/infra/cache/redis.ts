import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Inicializa a conexão
(async () => {
  await redisClient.connect();
  console.log('✅ Redis conectado com sucesso!');
})();

export default redisClient;
