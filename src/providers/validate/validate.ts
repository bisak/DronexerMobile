import { Injectable } from '@angular/core';
import isEmail from 'validator/lib/isEmail';

@Injectable()
export class ValidateProvider {
  constructor() {
  }

  validateProfilePicture(file) {
    if (file.size > 6 * 1000000) {
      return {
        isValid: false,
        msg: 'Profile picture should be 6MB or less'
      };
    }
    return {
      isValid: true,
      msg: ''
    };
  };

  validateRegisterInput(data, isEditData?) {
    if (!data.firstName) {
      return {
        isValid: false,
        msg: 'First Name is required'
      };
    }
    if (!data.lastName) {
      return {
        isValid: false,
        msg: 'Last Name is required'
      };
    }
    if (!data.username) {
      return {
        isValid: false,
        msg: 'Username is required'
      };
    }
    if (data.username.length < 6) {
      return {
        isValid: false,
        msg: 'Username sould be at least 6 characters long'
      };
    }
    if (!data.email) {
      return {
        isValid: false,
        msg: 'Email is required'
      };
    }
    if (!isEmail(data.email)) {
      return {
        isValid: false,
        msg: 'Please provide a valid email'
      };
    }
    if (!isEditData) {
      if (!data.password) {
        return {
          isValid: false,
          msg: 'Password is required'
        };
      }
    }
    if (data.password) {
      if (data.password != data.passwordConfirm) {
        return {
          isValid: false,
          msg: 'Passwords didn\'t match'
        };
      }
      if (data.password.length < 6) {
        return {
          isValid: false,
          msg: 'Password should be at least 6 characters long'
        };
      }
      if (data.password.length > 50) {
        return {
          isValid: false,
          msg: 'Password should be less than 50 characters long'
        };
      }
    }
    return {
      isValid: true,
      msg: ''
    };
  }

  getTagsArray(tags: string): Array<string> {
    let tagsArray = tags.split(' ')
      .filter((tag) => tag !== '' && tag.startsWith('#') && tag.length > 3 && tag.length <= 20)
      .map((tag) => tag.toLowerCase());
    if (tagsArray.length > 0 && tagsArray.length <= 15) {
      return tagsArray;
    } else {
      return [];
    }
  }

}
