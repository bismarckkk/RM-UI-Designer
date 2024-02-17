//
// Created by bismarckkk on 2024/2/17.
//

#ifndef SERIAL_TEST_UI_H
#define SERIAL_TEST_UI_H

#include "ui_interface.h"

#include "ui_default_ungroup1.h"
#include "ui_default_ungroup2.h"

#define ui_init_default_ungroup()  \
_ui_init_default_ungroup_1();      \
_ui_init_default_ungroup_2()

#define ui_update_default_ungroup()  \
_ui_update_default_ungroup_1();      \
_ui_update_default_ungroup_2()

#define ui_remove_default_ungroup()  \
_ui_remove_default_ungroup_1();      \
_ui_remove_default_ungroup_2()

#endif //SERIAL_TEST_UI_H
