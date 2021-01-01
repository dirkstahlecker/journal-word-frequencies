import { FullNamesDb } from "../db/FullNamesDb";
import { DisplayNameInfo, FullNameInfo } from "../db/DbUtils";
import { DisplayNamesDB } from "../db/DisplayNamesDB";

it('gets displaynames', async() => {
  let result: DisplayNameInfo[] | null = await DisplayNamesDB.get("dirk");
  expect(result.length).toEqual(1);
  expect(result[0].displayname).toEqual("dirk");

  result = await DisplayNamesDB.get("notfound");
  expect(result).toBeNull
});



it('adds and deletes fullnames', async() => {
  const displayName: string = "dirk";
  const newFirstName: string = "newFirst";
  const newLastName: string = "newLast";

  //verify initial
  const initialInfo: FullNameInfo[] | null = await FullNamesDb.get(displayName);
  const initialNumFullNames: number = initialInfo.length;
  
  //ADD
  await FullNamesDb.addNewFullName(displayName, newFirstName, newLastName);
  
  let fullNameInfo: FullNameInfo[] | null = await FullNamesDb.get(displayName);
  expect(fullNameInfo.length).toEqual(initialNumFullNames + 1);
  expect(fullNameInfo[initialNumFullNames].firstname).toEqual(newFirstName);
  expect(fullNameInfo[initialNumFullNames].lastname).toEqual(newLastName);

  //DELETE
  await FullNamesDb.deleteFullName(displayName, newFirstName, newLastName);
  fullNameInfo = await FullNamesDb.get(displayName);
  expect(fullNameInfo.length).toEqual(initialNumFullNames);
});

// it('gets fullnames', async() => {
//   let result: FullNameInfo[] | null = await FullNamesDb.get("dirk"); //TODO: don't rely on database state
//   expect(result.length).toEqual(2);
//   expect(result[0].firstname).toEqual("dirk");
//   expect(result[0].lastname).toEqual("stahlecker");
//   expect(result[1].firstname).toEqual("alternateFirst");
//   expect(result[1].lastname).toEqual("alternateLast");
// });