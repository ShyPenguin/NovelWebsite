import { Resource } from "@repo/contracts/auth/permissions/resource";

export const aOrAn = ({ resource }: { resource: Resource }) => {
  const firstLetter = resource.charAt(0);
  if (resource == "users") return "a";
  return isVowel(firstLetter) ? "an" : "a";
};

function isVowel(character: string) {
  const vowels = "aeiou";
  return vowels.includes(character.toLowerCase());
}
