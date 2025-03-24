//
// Created by RM UI Designer
// Dynamic Edition
//

#ifndef UI_g_H
#define UI_g_H

#include "ui_interface.h"

extern ui_interface_figure_t ui_g_now_figures[13];
extern ui_interface_string_t ui_g_now_strings[16];
extern uint8_t ui_g_dirty_figure[13];
extern uint8_t ui_g_dirty_string[16];

#define ui_g_Ungroup_NewArc ((ui_interface_arc_t*)&(ui_g_now_figures[0]))
#define ui_g_Ungroup_NewLine1 ((ui_interface_line_t*)&(ui_g_now_figures[1]))
#define ui_g_Ungroup_NewLine2 ((ui_interface_line_t*)&(ui_g_now_figures[2]))
#define ui_g_Ungroup_NewLine3 ((ui_interface_line_t*)&(ui_g_now_figures[3]))
#define ui_g_Ungroup_NewRect4 ((ui_interface_rect_t*)&(ui_g_now_figures[4]))
#define ui_g_Ungroup_NewRect5 ((ui_interface_rect_t*)&(ui_g_now_figures[5]))
#define ui_g_Ungroup_NewRect6 ((ui_interface_rect_t*)&(ui_g_now_figures[6]))
#define ui_g_Ungroup_NewRect7 ((ui_interface_rect_t*)&(ui_g_now_figures[7]))
#define ui_g_Ungroup_NewRect8 ((ui_interface_rect_t*)&(ui_g_now_figures[8]))
#define ui_g_Ungroup_NewRect9 ((ui_interface_rect_t*)&(ui_g_now_figures[9]))
#define ui_g_Ungroup_NewRect10 ((ui_interface_rect_t*)&(ui_g_now_figures[10]))
#define ui_g_AIM_SHOW_aim_ID ((ui_interface_number_t*)&(ui_g_now_figures[11]))
#define ui_g_AIM_SHOW_robo_HP ((ui_interface_number_t*)&(ui_g_now_figures[12]))

#define ui_g_Text_GIMPOWER (&(ui_g_now_strings[0]))
#define ui_g_Text_POWERLIM (&(ui_g_now_strings[1]))
#define ui_g_Text_SPEEDLIM (&(ui_g_now_strings[2]))
#define ui_g_Text_NORMAL (&(ui_g_now_strings[3]))
#define ui_g_Text_SMLBUFF (&(ui_g_now_strings[4]))
#define ui_g_Text_LARBUFF (&(ui_g_now_strings[5]))
#define ui_g_Text_ANTIRO (&(ui_g_now_strings[6]))
#define ui_g_Text_LOCK (&(ui_g_now_strings[7]))
#define ui_g_Text_FRIC (&(ui_g_now_strings[8]))
#define ui_g_Text_CAP (&(ui_g_now_strings[9]))
#define ui_g_Text_PTE (&(ui_g_now_strings[10]))
#define ui_g_Text_JUP (&(ui_g_now_strings[11]))
#define ui_g_Text_PWR (&(ui_g_now_strings[12]))
#define ui_g_Text_WHE (&(ui_g_now_strings[13]))
#define ui_g_Text_LES (&(ui_g_now_strings[14]))
#define ui_g_Ungroup_NewText (&(ui_g_now_strings[15]))

#ifdef MANUAL_DIRTY
#define ui_g_Ungroup_NewArc_dirty (ui_g_dirty_figure[0])
#define ui_g_Ungroup_NewLine1_dirty (ui_g_dirty_figure[1])
#define ui_g_Ungroup_NewLine2_dirty (ui_g_dirty_figure[2])
#define ui_g_Ungroup_NewLine3_dirty (ui_g_dirty_figure[3])
#define ui_g_Ungroup_NewRect4_dirty (ui_g_dirty_figure[4])
#define ui_g_Ungroup_NewRect5_dirty (ui_g_dirty_figure[5])
#define ui_g_Ungroup_NewRect6_dirty (ui_g_dirty_figure[6])
#define ui_g_Ungroup_NewRect7_dirty (ui_g_dirty_figure[7])
#define ui_g_Ungroup_NewRect8_dirty (ui_g_dirty_figure[8])
#define ui_g_Ungroup_NewRect9_dirty (ui_g_dirty_figure[9])
#define ui_g_Ungroup_NewRect10_dirty (ui_g_dirty_figure[10])
#define ui_g_AIM_SHOW_aim_ID_dirty (ui_g_dirty_figure[11])
#define ui_g_AIM_SHOW_robo_HP_dirty (ui_g_dirty_figure[12])

#define ui_g_Text_GIMPOWER_dirty (ui_g_dirty_string[0])
#define ui_g_Text_POWERLIM_dirty (ui_g_dirty_string[1])
#define ui_g_Text_SPEEDLIM_dirty (ui_g_dirty_string[2])
#define ui_g_Text_NORMAL_dirty (ui_g_dirty_string[3])
#define ui_g_Text_SMLBUFF_dirty (ui_g_dirty_string[4])
#define ui_g_Text_LARBUFF_dirty (ui_g_dirty_string[5])
#define ui_g_Text_ANTIRO_dirty (ui_g_dirty_string[6])
#define ui_g_Text_LOCK_dirty (ui_g_dirty_string[7])
#define ui_g_Text_FRIC_dirty (ui_g_dirty_string[8])
#define ui_g_Text_CAP_dirty (ui_g_dirty_string[9])
#define ui_g_Text_PTE_dirty (ui_g_dirty_string[10])
#define ui_g_Text_JUP_dirty (ui_g_dirty_string[11])
#define ui_g_Text_PWR_dirty (ui_g_dirty_string[12])
#define ui_g_Text_WHE_dirty (ui_g_dirty_string[13])
#define ui_g_Text_LES_dirty (ui_g_dirty_string[14])
#define ui_g_Ungroup_NewText_dirty (ui_g_dirty_string[15])
#endif

void ui_init_g();
void ui_update_g();

#endif //UI_g_H
