import * as tokenService from "../modules/auth/service/token.service";
import { IUserDto, UserDto } from "../dtos/user-dto";
import { UserInput } from "../modules/auth/models/user.model";

export const createTokenForUser = async (user: UserInput) => {
  const userDto = new UserDto(user); // ..ложим юзера и в итоге получаем три поля id, email, isActivated
  const tokens = tokenService.generateTokens({ ...userDto });

  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};
