
"""
created by Pushkar Lanka on 07/17/16

"""
import math


class UrlHash(object):

    global characters
    characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    # base_10 is an int
    # returns base_k (str)
    @staticmethod
    def get_base_k(base_10):
        length = len(characters)
        result = ''
        power_of = int(math.pow(length, int(math.log(base_10, length))))
        while power_of > 0:
            result += characters[int(base_10 // power_of)]
            base_10 %= power_of
            power_of = int(power_of // length)

        return result

    # base_k is a str
    # returns base_10 (int)
    @staticmethod
    def get_base_10(base_k):
        k = len(characters)
        power_of = 1
        result = 0
        for x in xrange(len(base_k) - 1, -1, -1):
            result += characters.index(base_k[x]) * power_of
            power_of *= k

        return result
