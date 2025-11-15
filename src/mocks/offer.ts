import { OfferPlaceType, OfferHostStatus, IDetailedOffer } from '../shared/types/offer.ts';

export const offerMocks: IDetailedOffer[] = [
  {
    id: 'd7ff50fd-07c1-4862-9dc0-a52fe909252c',
    info: {
      title: 'Beautiful & luxurious studio at great location',
      rating: 4.8,
      placeType: OfferPlaceType.Apartment,
      numberOfRooms: 3,
      numberOfGuests: 4,
      price: 120,
      isPremium: true,
      features: ['Wi-Fi', 'Heating', 'Kitchen', 'Fridge', 'Washing machine', 'Coffee machine', 'Dishwasher', 'Towels', 'Baby seat', 'Cabel TV'],
      image: 'img/room.jpg'
    },
    host: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg',
      status: OfferHostStatus.Pro,
      description: [
        'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
        'An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.'
      ],
    },
    reviews: [
      {
        name: 'Max',
        avatar: 'img/avatar-max.jpg',
        rating: 4,
        description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
        dateTime: '2019-04-24',
      }
    ],
    images: ['img/room.jpg', 'img/apartment-01.jpg', 'img/apartment-02.jpg', 'img/apartment-03.jpg', 'img/studio-01.jpg', 'img/studio-01.jpg'],
  },
  {
    id: 'a3b8e2f5-9c1d-4a7b-8e6f-3d2c1b0a9e8f',
    info: {
      title: 'Modern apartment in city center',
      rating: 4.5,
      placeType: OfferPlaceType.Flat,
      numberOfRooms: 2,
      numberOfGuests: 3,
      price: 95,
      isPremium: false,
      features: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'TV', 'Elevator', 'Balcony'],
      image: 'img/apartment-02.jpg'
    },
    host: {
      name: 'Max',
      avatar: 'img/avatar-max.jpg',
      status: OfferHostStatus.Beginner,
      description: [
        'Modern apartment located in the heart of the city with great transport connections.',
        'Recently renovated with new furniture and appliances.'
      ],
    },
    reviews: [
      {
        name: 'Angelina',
        avatar: 'img/avatar-angelina.jpg',
        rating: 5,
        description: 'Great location and very clean apartment. Would definitely stay again!',
        dateTime: '2024-01-15',
      },
      {
        name: 'John',
        avatar: 'img/avatar-max.jpg',
        rating: 4,
        description: 'Comfortable stay with all necessary amenities provided.',
        dateTime: '2024-01-10',
      }
    ],
    images: ['img/apartment-02.jpg', 'img/room.jpg', 'img/apartment-01.jpg', 'img/apartment-03.jpg', 'img/studio-01.jpg', 'img/studio-01.jpg'],
  },
  {
    id: 'c5d9f8a2-7b4e-1c6d-9f3a-8e2b4c7a1d5f',
    info: {
      title: 'Cozy house with garden',
      rating: 4.9,
      placeType: OfferPlaceType.House,
      numberOfRooms: 4,
      numberOfGuests: 6,
      price: 180,
      isPremium: true,
      features: ['Wi-Fi', 'Garden', 'Parking', 'Fireplace', 'BBQ', 'Pet friendly', 'Washing machine'],
      image: 'img/apartment-01.jpg'
    },
    host: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg',
      status: OfferHostStatus.Pro,
      description: [
        'Charming house with beautiful garden in quiet neighborhood.',
        'Perfect for families and those looking for peaceful retreat.'
      ],
    },
    reviews: [
      {
        name: 'Sarah',
        avatar: 'img/avatar-max.jpg',
        rating: 5,
        description: 'Absolutely loved the garden and peaceful atmosphere. Perfect family vacation!',
        dateTime: '2024-02-20',
      },
      {
        name: 'Mike',
        avatar: 'img/avatar-max.jpg',
        rating: 5,
        description: 'Beautiful house with everything we needed. Will come back for sure.',
        dateTime: '2024-02-15',
      },
      {
        name: 'Emma',
        avatar: 'img/avatar-angelina.jpg',
        rating: 4,
        description: 'Very comfortable and well-equipped house. Great value for money.',
        dateTime: '2024-02-10',
      }
    ],
    images: ['img/apartment-01.jpg', 'img/apartment-03.jpg', 'img/room.jpg', 'img/apartment-02.jpg', 'img/studio-01.jpg', 'img/studio-01.jpg'],
  },
  {
    id: 'e8f7d2c1-9a6b-4e5d-8c3f-2b1a9e7d6c5f',
    info: {
      title: 'Studio apartment near metro',
      rating: 4.2,
      placeType: OfferPlaceType.Flat,
      numberOfRooms: 1,
      numberOfGuests: 2,
      price: 75,
      isPremium: false,
      features: ['Wi-Fi', 'Kitchenette', 'TV', 'Workspace', 'Public transport nearby'],
      image: 'img/apartment-03.jpg'
    },
    host: {
      name: 'Max',
      avatar: 'img/avatar-max.jpg',
      status: OfferHostStatus.Beginner,
      description: [
        'Compact and functional studio perfect for short stays.',
        'Excellent location with metro station just 5 minutes away.'
      ],
    },
    reviews: [
      {
        name: 'Lisa',
        avatar: 'img/avatar-angelina.jpg',
        rating: 4,
        description: 'Good value for money. Perfect for solo travelers or couples.',
        dateTime: '2024-03-05',
      }
    ],
    images: ['img/apartment-03.jpg', 'img/studio-01.jpg', 'img/room.jpg', 'img/apartment-01.jpg', 'img/apartment-02.jpg', 'img/studio-01.jpg'],
  }
];
