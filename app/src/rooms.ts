/** Four invented rooms. No room exists and none can be booked. */
export interface Room {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  price: number;
  sleeps: number;
}

export const ROOMS: Room[] = [
  { slug: "harbour-single", name: "Harbour single", summary: "One bed, a desk, a view of the cranes.", detail: "A small room over the water, warm in winter, with a desk that fits a laptop and little else.", price: 74, sleeps: 1 },
  { slug: "pilot-double", name: "Pilot double", summary: "A double bed and a bath.", detail: "The old pilot's room: a double bed, a deep bath, and a window that rattles politely in a gale.", price: 118, sleeps: 2 },
  { slug: "netmakers-loft", name: "Netmaker's loft", summary: "Two rooms under the eaves.", detail: "A loft with two bedrooms, a kitchen along one wall, and the harbour lights through the skylight.", price: 165, sleeps: 4 },
  { slug: "keepers-cottage", name: "Keeper's cottage", summary: "A cottage of its own, along the sea wall.", detail: "Five minutes along the sea wall: two bedrooms, a stove, and no neighbours to speak of.", price: 210, sleeps: 5 },
];

export const roomBySlug = (slug: string) => ROOMS.find((room) => room.slug === slug) ?? null;
