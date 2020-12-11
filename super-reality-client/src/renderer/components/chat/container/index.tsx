import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import feathers from "@feathersjs/client";
import v1 from "uuid";
import ButtonSimple from "../../button-simple";

// const { publicRuntimeConfig } =

const apiServer = `http://3.101.18.208:3030`;

// Socket.io is exposed as the `io` global.
const socket = io(apiServer, {
  transports: ["websocket"],
  upgrade: false,
});

// @feathersjs/client is exposed as the `feathers` global.
export const client = feathers();

client.configure(feathers.socketio(socket, { timeout: 10000 }));
client.configure(
  feathers.authentication({
    storageKey: "XREngine-Auth-Store",
  })
);
interface groupsArray {}

export default function TestChat(): JSX.Element {
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState<Array<any>>();
  // const [count, setCount] = useState(0);

  // useEffect(() => {}, [groups?.length]);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc0NDEyMzQsImV4cCI6MTYxMDAzMzIzNCwic3ViIjoiZDkwNzBmODAtMzk2OS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiMTI2NWMwYjEtNjM3Mi00MTFlLWI1MDMtYzY3NTJhOWZjN2EyIn0.-uukMq5GFnRRbedBlXKQfmYmJbiupXpz1cjer6SNya4";
  useEffect(() => {
    const test = async () => {
      // await (client as any).authentication.setAccessToken(
      //   accessToken as string
      // );

      let res;
      try {
        res = await (client as any).reAuthenticate();
        console.log("chat auth ok", res);
      } catch (err) {
        console.log(err);
      }
      const userData = await client
        .service("user")
        .get("d9062520-3969-11eb-8818-054b8fb93e03");
      setUser(userData);
      console.log("user data", userData);
      // if (res) {
      //   console.log(res);
      //   const userData = await client
      //     .service("user")
      //     .get("d9062520-3969-11eb-8818-054b8fb93e03");
      //   console.log(userData);
      //   // loadUserData(dispatch, authUser.identityProvider.userId);
      // } else {
      //   console.log("****************");
      // }
      // /// // change the name
      // client
      //   .service("user")
      //   .patch("d9062520-3969-11eb-8818-054b8fb93e03", {
      //     name: "TestDen",
      //   })
      //   .then((resN: any) => {
      //     console.log("name Updated", resN);
      //   });

      // const groupResults = await client.service("group").find();

      // console.log(groupResults);
      // console.log("waiting identity-provider");
      //  !!!!!!!!!! const newProvider = await client.service("identity-provider").create({
      //   type: "guest",
      //   token: v1(),
      // });
      // console.log(newProvider);
      // const res = await (client as any).authenticate({
      //   strategy: "jwt",
      //   accessToken: newProvider.accessToken,
      // });
      // console.log(res);
      // client
      //   .service("magic-link")
      //   .create({
      //     email: "email",
      //     type: "email",
      //     userId: "userId",
      //   })
      //   .then((res: any) => {
      //     console.log(res);
      //     const identityProvider = res;
      //     console.log("indProv", identityProvider.userId);
      //   });
    };
    // const main = async () => {
    //   // Find all existing messages
    //   const messages = await client.service("messages").find();

    //   // Add existing messages to the list
    //   messages.forEach(test);

    //   // Add any newly created message to the list in real-time
    //   client.service("messages").on("created", test);
    // };
    test();
  }, []);
  // test getting the groups
  useEffect(() => {
    const refreshGroups = async () => {
      const groupResults = await client.service("group").find();
      setGroups(groupResults.data);
      console.log(groupResults.data);
    };
    refreshGroups();
  }, [groups?.length]);
  console.log("groups", groups);
  const createTestGroup = async () => {
    const count = groups ? groups.length + 1 : 0;
    console.log(count);
    try {
      const res = await client.service("group").create({
        name: `testGroup ${count}`,
        description: "Test group for the Test ",
      });
      if (res) {
        const groupResults = await client.service("group").find();

        console.log(groupResults);
        setGroups(groupResults.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const removeGroup = async () => {
    if (groups && groups?.length > 0) {
      await client.service("group").remove(groups[groups?.length - 1].id);
      client.service("group").on("removed", (params: any) => {
        console.log(params.group);
      });
      const groupResults = await client.service("group").find();

      console.log(groupResults);
      setGroups(groupResults.data);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <ButtonSimple
        style={{
          margin: "10px",
        }}
        onClick={createTestGroup}
      >
        createTestGroup
      </ButtonSimple>
      <ButtonSimple
        style={{
          margin: "10px",
        }}
        onClick={removeGroup}
      >
        removeGroup
      </ButtonSimple>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          height: "calc(100%-65px)",
        }}
      >
        {groups ? (
          groups.map((item) => {
            console.log(item.name);
            return (
              <div key={item.id}>
                <div
                  style={{
                    margin: "10px",
                    color: "var(--color-text-active)",
                    backgroundColor: "var(--color-button)",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    margin: "10px",
                  }}
                >
                  Group description:
                </div>
                <div
                  style={{
                    margin: "10px",
                  }}
                >
                  {item.description}
                </div>
                <div
                  style={{
                    margin: "10px",
                  }}
                >
                  {item.users.map((groupUser: any) => {
                    return (
                      <div key={groupUser.id}>
                        <div>Group user:</div>
                        <div>{groupUser.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div>No Groups</div>
        )}
      </div>
    </div>
  );
}

/*
identity-provider ////
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc0NDEyMzQsImV4cCI6MTYxMDAzMzIzNCwic3ViIjoiZDkwNzBmODAtMzk2OS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiMTI2NWMwYjEtNjM3Mi00MTFlLWI1MDMtYzY3NTJhOWZjN2EyIn0.-uukMq5GFnRRbedBlXKQfmYmJbiupXpz1cjer6SNya4"
createdAt: "2020-12-08T15:27:14.040Z"
id: "d9070f80-3969-11eb-8880-8d9713c0b54d"
token: "450363e0-2d5f-4a4c-97a9-17bbc79ada96"
type: "guest"
updatedAt: "2020-12-08T15:27:14.040Z"
user:
createdAt: "2020-12-08T15:27:14.041Z"
id: "d9062520-3969-11eb-8818-054b8fb93e03"
name: "Friended Funnelweaverspider"
updatedAt: "2020-12-08T15:27:14.041Z"
userRole: "guest"
userId: "d9062520-3969-11eb-8818-054b8fb93e03"

auth ////
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc0NDEyMzQsImV4cCI6MTYxMDAzMzIzNCwic3ViIjoiZDkwNzBmODAtMzk2OS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiMTI2NWMwYjEtNjM3Mi00MTFlLWI1MDMtYzY3NTJhOWZjN2EyIn0.-uukMq5GFnRRbedBlXKQfmYmJbiupXpz1cjer6SNya4"
authentication:
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc0NDEyMzQsImV4cCI6MTYxMDAzMzIzNCwic3ViIjoiZDkwNzBmODAtMzk2OS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiMTI2NWMwYjEtNjM3Mi00MTFlLWI1MDMtYzY3NTJhOWZjN2EyIn0.-uukMq5GFnRRbedBlXKQfmYmJbiupXpz1cjer6SNya4"
payload: {iat: 1607441234, exp: 1610033234, sub: "d9070f80-3969-11eb-8880-8d9713c0b54d", jti: "1265c0b1-6372-411e-b503-c6752a9fc7a2"}
strategy: "jwt"
__proto__: Object
identity-provider:
createdAt: "2020-12-08T15:27:14.000Z"
id: "d9070f80-3969-11eb-8880-8d9713c0b54d"
isVerified: null
resetExpires: null
resetToken: null
token: "450363e0-2d5f-4a4c-97a9-17bbc79ada96"
type: "guest"
updatedAt: "2020-12-08T15:27:14.000Z"
userId: "d9062520-3969-11eb-8818-054b8fb93e03"
verifyChanges: null
verifyExpires: null
verifyShortToken: null
verifyToken: null
*/
