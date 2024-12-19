import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';
import { describe } from 'node:test';

describe('TweetsService', () => {
  let service: TweetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsService],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTweets', () => {
    it('should create tweet', () => {
      // Arrange
      service.tweets = [];
      const payload = 'This is my tweet';

      // Act
      const tweet = service.createTweet(payload);

      // Assert
      expect(tweet).toBe(payload);
      expect(service.tweets).toHaveLength(1);
    });
  });

  it('should prevent tweets created which are over 100 characters', () => {
    // Arrange
    const payload =
      'This is a long tweet over 100 characters This is a long tweet over 100 characters This is a long t...';

    // Act
    const tweet = () => {
      return service.createTweet(payload);
    };

    // Assert
    expect(tweet).toThrowError();
  });

  describe('updateTweet', () => {
    it('should update tweet', () => {
      service.tweets = ['Quan'];
      const updatedTweet = service.updateTweet('Nguyen', 0);

      expect(updatedTweet).toBe('Nguyen');
      expect(service.tweets[0]).toBe('Nguyen');
    });

    it('should prevent updating tweet not exists', () => {
      service.tweets = ['Quan', 'Nguyen'];

      const updatedTweet = () => {
        return service.updateTweet('Nguyen', 2);
      };

      expect(updatedTweet).toThrow('This Tweet does not exist');
    });

    it('should prevent updating tweet too long', () => {
      service.tweets = ['Quan'];
      const payload =
        'So the previous example was quite simple. In the TweetsService, we used 0 dependencies (i.e. nothing was passed into the constructor), which simplifies our unit tests.';

      const updatedTweet = () => {
        return service.updateTweet(payload, 0);
      };

      expect(updatedTweet).toThrow('Tweet too long');
    });
  });

  describe('getTweets', () => {
    it('should get tweets', () => {
      const mock = ['Quan', 'Nguyen'];
      service.tweets = mock;

      const tweets = service.getTweets();

      expect(tweets).toHaveLength(mock.length);
      expect(tweets[0]).toBe(mock[0]);
    });
  });

  describe('deleteTweet', () => {
    it('should delete tweet', () => {
      const mock = ['Quan', 'Nguyen'];
      const index = 0;
      service.tweets = mock.slice();

      const deletedTweet = service.deleteTweet(index);

      expect(service.tweets).toHaveLength(mock.length - 1);
      expect(deletedTweet[index]).toBe(mock[index]);
    });

    it('should prevent deleting tweet not exist', () => {
      const mock = ['Quan', 'Nguyen'];
      service.tweets = mock;

      const deletedTweet = () => {
        return service.deleteTweet(2);
      };

      expect(deletedTweet).toThrow('This Tweet does not exist');
    });
  });
});
