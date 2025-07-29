import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private tokenSet = new Set<string>(); // Renamed from `blacklist`

  async blacklist(token: string) {
    this.tokenSet.add(token);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return this.tokenSet.has(token);
  }
}
