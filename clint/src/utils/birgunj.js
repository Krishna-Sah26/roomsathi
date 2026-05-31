export const isBirgunjText = (value = "") => value.toLowerCase().includes("birgunj")

export const inferBirgunjArea = (value = "") => {
  const normalizedValue = value.toLowerCase()

  if (!isBirgunjText(normalizedValue)) {
    return "Ghantaghar"
  }

  const areaRules = [
    ["ghantaghar", "Ghantaghar"],
    ["adarshnagar", "Adarshnagar"],
    ["pratima chowk", "Pratima Chowk"],
    ["pratima", "Pratima Chowk"],
    ["vishuwa", "Vishuwa"],
    ["fulwari", "Fulwaritole"],
    ["power house", "Power House"],
    ["link road", "Link Road"],
    ["main road", "Main Road"],
    ["birta", "Birta"],
    ["chhapkaiya", "Chhapkaiya"],
    ["ranighat", "Ranighat"],
  ]

  const matchedArea = areaRules.find(([needle]) => normalizedValue.includes(needle))

  return matchedArea ? matchedArea[1] : "Birgunj Center"
}
