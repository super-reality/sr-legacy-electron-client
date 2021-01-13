import client from "../../renderer/feathers"

export const getGroups = async()=>{
    await (client as any).service('groups').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
        },
      });
    
}