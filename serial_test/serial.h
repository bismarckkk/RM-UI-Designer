//
// Created by abc55 on 2024/3/11.
//

#ifndef SERIAL_TEST_SERIAL_H
#define SERIAL_TEST_SERIAL_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void write(uint8_t* msg, int len);

#ifdef __cplusplus
}
#endif

#endif //SERIAL_TEST_SERIAL_H
