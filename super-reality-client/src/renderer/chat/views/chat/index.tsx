import React, { useState } from "react";
import _ from "lodash";
import client from "../../redux/feathers";
// import v1 from "uuid";

// import { Group } from "../../common/interfaces/Group";
// import { Channel } from "../../common/interfaces/Channel";
import GroupsList from "../../components/group-list";
import MembersList from "../../components/members-list";
import TextChat from "../../components/text-chat";

import { dChannel, dChannels } from "./dummy-data";

export default function TestChat() {
  // const [user, setUser] = useState({});
  // const [groups, setGroups] = useState<Array<any>>();
  // const [parties, setParties] = useState<Array<any>>();
  const [channels, setChannels] = useState<Array<any>>(dChannels);
  const [activeChannel, setActiveChannel] = useState<any>(dChannel);

  // const [activeGroup, setActiveGroup] = useState<any>(dChannel);

  // const getChannels = async () => {
  //   try {
  //     console.log("FETCHING CHANNELS");
  //     const { data } = await client.service("channel").find({
  //       query: {
  //         $limit: 8,
  //         $skip: 0,
  //       },
  //     });
  //     console.log("channelResult", data);
  //     const channelsResult = data.filter((e: any) => e.channelType == "group");
  //     setChannels(channelsResult);

  //     console.log("channels", channels);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const refreshGroups = async () => {
  //   const groupResults = await client.service("group").find();
  //   // setGroups(groupResults.data);
  //   console.log(groupResults.data);
  // };

  // useEffect(() => {
  // const login = async () => {
  //   // await (client as any).authentication.setAccessToken(
  //   //   accessToken as string
  //   // );

  //   let res;
  //   try {
  //     res = await (client as any).reAuthenticate();
  //     console.log("chat auth ok", res);
  //   } catch (err) {
  //     console.log("err chat auth", err);
  //   }

  //   const userData = await client
  //     .service("user")
  //     .get("d9062520-3969-11eb-8818-054b8fb93e03");

  //   console.log("user data", userData);
  // try {
  //   res = await (client as any)
  //     .service("channel")
  //     .remove("96a91260-3648-11eb-8880-8d9713c0b54d");
  //   console.log("channel removed", res);
  // } catch (err) {
  //   console.log("err channel removed", err);
  // }

  // // Parties
  // const parties = await client.service("party").find();

  // console.log("Parties", parties);

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
  //     name: "Test DenisKo Name",
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
  // };
  // login();

  // getChannels();
  // if (channels) {
  //   setActiveChannel(channels[0]);
  //   console.log("ok loading");
  // }

  // getChannelMessages();
  // }, []);
  // test getting the groups

  /*
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

  const showParties = useCallback(async () => {
    // Parties
    const partiesFromAPI = await client.service("party").find();
    setParties(partiesFromAPI);
    console.log("Parties", partiesFromAPI);
    console.log(parties);
    // Channels
    getChannels();
  }, []);

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
*/
  // const joinTheParty = useCallback((userId: string, partyId: number) => {
  //   (client as any).io.emit(
  //     "join-party",
  //     {
  //       userId,
  //       partyId,
  //     },
  //     (res: any) => {
  //       console.log("Join Party response: ", res);
  //     }
  //   );
  // }, []);

  const updateChatTarget = async (targetObject: any) => {
    console.log(
      "targetObject:",
      targetObject,
      "targetObjectType:",
      targetObject.type
    );
    // remove thiss
    setChannels(dChannels);
    const targetChannelResult = await client.service("channel").find({
      query: {
        findTargetId: true,
        targetObjectType: targetObject.type,
        targetObjectId: targetObject.id,
      },
    });
    // if (targetObject.type == "group" && groups) {
    //   const newActiveGroup = groups.find(
    //     (group) => group.id == targetObject.groupId
    //   );
    //   console.log("newActiveGroup", newActiveGroup);
    // }
    // else if (targetObject.type == "party" && parties) {
    //   const newActiveParty = parties.find(
    //     (party) => party.id == targetObject.partyId
    //   );
    //   setActiveGroup(newActiveParty);
    // }
    // setMessages(["message added"]);
    setActiveChannel(targetObject);
    // getChannelMessages(targetObject.id);

    console.log("setActiveChannel:", activeChannel);

    console.log("updateChatTarget:", targetChannelResult);
  };

  const createMessage = async (values: any) => {
    try {
      const resp = await client.service("message").create({
        targetObjectId: values.targetObjectId,
        targetObjectType: values.targetObjectType,
        text: values.text,
      });
      console.log(resp);
    } catch (err) {
      console.log(err);
    }
  };

  // client.service("message").on("created", (params: any) => {
  //   console.log("MESSAGE CREATED EVENT");
  //   console.log(params);
  //   // getChannelMessages();
  // });

  //   const getMessageUser = (message: Message): User => {
  //     let user;
  //     const channel = channels?.find(ch => ch.id == message.channelId);
  //     if (channel && channel.channelType === 'user') {
  //         user = channel.userId1 === message.senderId ? channel.user1 : channel.user2;
  //     } else if (channel && channel.channelType === 'group') {
  //         const groupUser = _.find(channel.group.groupUsers, (groupUser) => {
  //             return groupUser.userId === message.senderId;
  //         });
  //         user = groupUser != null ? groupUser.user : {};
  //     } else if (channel.channelType === 'party') {
  //         const partyUser = _.find(channel.party.partyUsers, (partyUser) => {
  //             return partyUser.userId === message.senderId;
  //         });
  //         user = partyUser != null ? partyUser.user : {};
  //     } else if (channel.channelType === 'instance') {
  //         const instanceUser = _.find(channel.instance.instanceUsers, (instanceUser) => {
  //             return instanceUser.id === message.senderId;
  //         });
  //         user = instanceUser != null ? instanceUser : {};
  //     }

  //     return user;
  // };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "auto",
      }}
    >
      {channels && activeChannel && (
        <GroupsList
          groups={channels}
          callback={updateChatTarget}
          activeGroupId={activeChannel.id}
        />
      )}
      {activeChannel && <MembersList users={activeChannel.group.groupUsers} />}
      {activeChannel && (
        <TextChat createMessage={createMessage} activeChannel={activeChannel} />
      )}
    </div>
  );
}

/*

first Denis user token
accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDcwMjAxMzUsImV4cCI6MTYwOTYxMjEzNSwic3ViIjoiMzE5Nzk4ZjAtMzU5NS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiYzY4NmU2ZjAtZjNkMy00MjJhLTk5MzgtNjdkNDMyMWQ3OGE4In0.a9_BGa4hAUHBHoDlGqBpKVtntbweoO0if1B_onqnc84"
credentials: {email: "test@test.com",…}
email: "test@test.com"
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDcwMjAxMzUsImV4cCI6MTYwOTYxMjEzNSwic3ViIjoiMzE5Nzk4ZjAtMzU5NS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiYzY4NmU2ZjAtZjNkMy00MjJhLTk5MzgtNjdkNDMyMWQ3OGE4In0.a9_BGa4hAUHBHoDlGqBpKVtntbweoO0if1B_onqnc84"

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

<div
        style={{
          width: "45%",
        }}
      >
        <textarea
          value={text}
          name="text"
          cols={30}
          rows={10}
          onChange={onTextChange}
        />

        <ButtonSimple
          style={{
            margin: "10px",
          }}
          onClick={() => {
            createMessage(text);
          }}
        >
          Send Message
        </ButtonSimple>

        <ButtonSimple
          style={{
            margin: "10px",
          }}
          onClick={showParties}
        >
          Get Parties
        </ButtonSimple>

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
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                  }}
                >
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
                  <ButtonSimple
                    onClick={() => {
                      updateChatTarget(item);
                    }}
                  >
                    Start Chat
                  </ButtonSimple>
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            height: "calc(100%-65px)",
          }}
        >
          {typeof channels == "object" ? (
            channels.map((channel) => {
              return (
                <div
                  key={channel.id}
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      margin: "10px",
                    }}
                  >
                    Channel id: {channel.id}
                  </div>
                  <div
                    style={{
                      margin: "10px",
                    }}
                  >
                    Channel type: {channel.channelType}
                  </div>

                  <ButtonSimple
                    style={{
                      margin: "10px",
                    }}
                    onClick={() => {
                      updateChatTarget(channel);
                    }}
                  >
                    Choose this channel
                  </ButtonSimple>
                </div>
              );
            })
          ) : (
            <div>No Parties</div>
          )}
        </div>
      </div>

      <div
        style={{
          width: "45%",
        }}
      >
        <div>Chat</div>
        <div
          style={{
            backgroundColor: "var(--color-background-dark)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "90%",
          }}
        >
          {typeof messages == "object"
            ? messages.map((message) => {
                return (
                  <div key={message.id}>
                    <div
                      style={{
                        margin: "10px",
                      }}
                    >
                      {message.senderId}
                    </div>
                    <div
                      style={{
                        margin: "10px",
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>

*/
