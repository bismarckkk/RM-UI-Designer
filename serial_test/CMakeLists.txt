cmake_minimum_required(VERSION 3.27)
project(serial_test)

set(CMAKE_C_STANDARD 99)

add_executable(serial_test main.cpp
        ui_interface.c
        ui_interface.h
        ui_types.h
        ui_default_ungroup_0.c
        ui_default_ungroup_1.c
        serialib.cpp
)
