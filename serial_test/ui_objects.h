//
// Created by abc55 on 2025/3/19.
//

#ifndef UI_OBJECTS_HPP
#define UI_OBJECTS_HPP

#include "ui_types.h"

extern ui_interface_rect_t *ui_default_ungroup_rect;
extern ui_interface_arc_t *ui_default_ungroup_arc;
extern ui_interface_string_t *ui_default_ungroup_string;
extern ui_interface_string_t *ui_default_Ungroup_NewText;
extern ui_interface_line_t *ui_default_Ungroup_NewLine;
extern ui_interface_rect_t *ui_default_Ungroup_NewRect;
extern uint8_t *ui_default_ungroup_rect_dirty;
extern uint8_t *ui_default_ungroup_arc_dirty;
extern uint8_t *ui_default_ungroup_string_dirty;
extern uint8_t *ui_default_Ungroup_NewText_dirty;
extern uint8_t *ui_default_Ungroup_NewLine_dirty;
extern uint8_t *ui_default_Ungroup_NewRect_dirty;

void ui_objects_init();
void ui_objects_update();

#endif //UI_OBJECTS_HPP
