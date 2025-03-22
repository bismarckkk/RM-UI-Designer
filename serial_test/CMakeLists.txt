cmake_minimum_required(VERSION 3.27)
project(serial_test)

set(CMAKE_C_STANDARD 99)

add_executable(serial_test main.cpp
        ui_interface.c
        ui_g.c
        ui_g.h
        ui_interface.h
        ui_types.h
        serialib.cpp
)
