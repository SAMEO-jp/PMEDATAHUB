import { createTRPCRouter } from '../trpc';

import { bomBuhinRouter } from './bomBuhin';
import { bomZumenRouter } from './bomZumen';
import { tableManagementRouter } from './db/tableManagement';
import { zumenAssemblySearchRouter } from './app/zumenAssemblySearch';
import { paletRouter } from './palet';
import { photosRouter } from './photos';
import { zissekiRouter } from './zisseki';


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bomBuhin: bomBuhinRouter,
  bomZumen: bomZumenRouter,
  tableManagement: tableManagementRouter,
  zumenAssemblySearch: zumenAssemblySearchRouter,
  palet: paletRouter,
  photos: photosRouter,
  zisseki: zissekiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter; 