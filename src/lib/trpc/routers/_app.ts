import { createTRPCRouter } from '../trpc';

import { bomBuhinRouter } from './bomBuhin';
import { bomZumenRouter } from './bomZumen';
import { tableManagementRouter } from './db/tableManagement';
import { zumenAssemblySearchRouter } from './app/zumenAssemblySearch';
import { setsubiRouter } from './app/setsubi';
import { kounyuRouter } from './app/kounyu';
import { userRouter } from './app/user';
import { paletRouter } from './palet';
import { photosRouter } from './photos';
import { zissekiRouter } from './zisseki';

// 新しいDB管理用ルーター
import { tableRouter } from './db/table';
import { sqlRouter } from './db/sql';
import { statisticsRouter } from './db/statistics';
import { authRouter } from './db/auth';
import { projectRouter } from './db/project';
import { projectMemberRouter } from './db/projectMember';
import { setsubiAssignmentRouter } from './db/setsubiAssignment';
import { kounyuAssignmentRouter } from './db/kounyuAssignment';
import { departmentRouter } from './db/department';

// Box item用ルーター
import { boxRouter } from './box';


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
  setsubi: setsubiRouter,
  kounyu: kounyuRouter,
  user: userRouter,
  palet: paletRouter,
  photos: photosRouter,
  zisseki: zissekiRouter,
  
  // 新しいDB管理用ルーター
  table: tableRouter,
  sql: sqlRouter,
  statistics: statisticsRouter,
  auth: authRouter,
  project: projectRouter,
  projectMember: projectMemberRouter,
  setsubiAssignment: setsubiAssignmentRouter,
  kounyuAssignment: kounyuAssignmentRouter,
  department: departmentRouter,

  // Box item用ルーター
  box: boxRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter; 