//
// Created by RM UI Designer
// Dynamic Edition
//

#ifndef UI_g_H
#define UI_g_H

#include "ui_interface.h"

extern ui_interface_arc_t *ui_g_Ungroup_NewArc;
extern ui_interface_line_t *ui_g_Ungroup_NewLine1;
extern ui_interface_line_t *ui_g_Ungroup_NewLine2;
extern ui_interface_line_t *ui_g_Ungroup_NewLine3;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect4;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect5;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect6;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect7;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect8;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect9;
extern ui_interface_rect_t *ui_g_Ungroup_NewRect10;
extern ui_interface_number_t *ui_g_AIM_SHOW_aim_ID;
extern ui_interface_number_t *ui_g_AIM_SHOW_robo_HP;

extern ui_interface_string_t *ui_g_Text_GIMPOWER;
extern ui_interface_string_t *ui_g_Text_POWERLIM;
extern ui_interface_string_t *ui_g_Text_SPEEDLIM;
extern ui_interface_string_t *ui_g_Text_NORMAL;
extern ui_interface_string_t *ui_g_Text_SMLBUFF;
extern ui_interface_string_t *ui_g_Text_LARBUFF;
extern ui_interface_string_t *ui_g_Text_ANTIRO;
extern ui_interface_string_t *ui_g_Text_LOCK;
extern ui_interface_string_t *ui_g_Text_FRIC;
extern ui_interface_string_t *ui_g_Text_CAP;
extern ui_interface_string_t *ui_g_Text_PTE;
extern ui_interface_string_t *ui_g_Text_JUP;
extern ui_interface_string_t *ui_g_Text_PWR;
extern ui_interface_string_t *ui_g_Text_WHE;
extern ui_interface_string_t *ui_g_Text_LES;
extern ui_interface_string_t *ui_g_Ungroup_NewText;

#ifdef MANUAL_DIRTY
extern uint8_t *ui_g_Ungroup_NewArc_dirty;
extern uint8_t *ui_g_Ungroup_NewLine1_dirty;
extern uint8_t *ui_g_Ungroup_NewLine2_dirty;
extern uint8_t *ui_g_Ungroup_NewLine3_dirty;
extern uint8_t *ui_g_Ungroup_NewRect4_dirty;
extern uint8_t *ui_g_Ungroup_NewRect5_dirty;
extern uint8_t *ui_g_Ungroup_NewRect6_dirty;
extern uint8_t *ui_g_Ungroup_NewRect7_dirty;
extern uint8_t *ui_g_Ungroup_NewRect8_dirty;
extern uint8_t *ui_g_Ungroup_NewRect9_dirty;
extern uint8_t *ui_g_Ungroup_NewRect10_dirty;
extern uint8_t *ui_g_AIM_SHOW_aim_ID_dirty;
extern uint8_t *ui_g_AIM_SHOW_robo_HP_dirty;

extern uint8_t *ui_g_Text_GIMPOWER_dirty;
extern uint8_t *ui_g_Text_POWERLIM_dirty;
extern uint8_t *ui_g_Text_SPEEDLIM_dirty;
extern uint8_t *ui_g_Text_NORMAL_dirty;
extern uint8_t *ui_g_Text_SMLBUFF_dirty;
extern uint8_t *ui_g_Text_LARBUFF_dirty;
extern uint8_t *ui_g_Text_ANTIRO_dirty;
extern uint8_t *ui_g_Text_LOCK_dirty;
extern uint8_t *ui_g_Text_FRIC_dirty;
extern uint8_t *ui_g_Text_CAP_dirty;
extern uint8_t *ui_g_Text_PTE_dirty;
extern uint8_t *ui_g_Text_JUP_dirty;
extern uint8_t *ui_g_Text_PWR_dirty;
extern uint8_t *ui_g_Text_WHE_dirty;
extern uint8_t *ui_g_Text_LES_dirty;
extern uint8_t *ui_g_Ungroup_NewText_dirty;
#endif

void ui_init_g();
void ui_update_g();

#endif //UI_g_H
