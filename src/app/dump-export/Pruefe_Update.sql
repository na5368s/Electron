-- Pruefskript zum pruefen fehlender Updateskripte
-- 18.12.07 mey nur noch Updates ab 2006, da kein Kunde einen älteren Stand hat
-- 01.10.09 gsa : Ohne Tabelle

SET FEEDBACK OFF;
SET SERVEROUTPUT ON SIZE 1000000
DECLARE
  TYPE T_UpdTab IS TABLE OF VARCHAR2(200);
  
  tabUpd      T_UpdTab;
  tabVersion  T_UpdTab;
  tabFehlt    T_UpdTab;
  i           PLS_INTEGER;
  bOK         BOOLEAN;
  iPos        PLS_INTEGER;
  sVer        Sy_Update_Log.Version%TYPE;
  sBez        Sy_Update_Log.Bez%TYPE;
  iDBAnz      PLS_INTEGER;
  sDBVer      Sy_Update_Log.Version%TYPE;
BEGIN
  -- Geforderte Updates definieren (<Version>~XLS_Import:<Bez>)
  tabUpd := T_UpdTab (
      '1~Update20060116_al'
    , '1~Update20060126_al_eali_ea'
    , '1~Update20060131_sy_parameter'
    , '1~Update20060203_er_koli_xx'
    , '1~Update20060209_atli_at'
    , '1~Update20060209_sy_parameter'
    , '1~Update20060209_algr'
    , '1~Update20060221_pz'
    , '1~Update20060222_2_al_bw'
    , '1~Update20060301_al_bw'
    , '1~Update20060301_al_eali_ea'
    , '1~Update20060310_al_bw'
    , '1~Update20060310_al_la'
    , '1~Update20060315_al'
    , '1~Update20060316_gz_bk'
    , '1~Update20060316_sy_parameter'
    , '1~Update20060321_al'
    , '1~Update20060321'
    , '1~Update20060321_al_la'
    , '1~Update20060328_sy_parameter'
    , '1~Update20060330_al_bd_rs'
    , '1~Update20060411_er_fa_pzph'
    , '1~Update20060412_re_al_men'
    , '1~Update20060426_ssin_la'
    , '1~Update20060427_sy_anz_guelt'
    , '1~Update20060428_koli'
    , '1~Update20060428_ag'
    , '1~Update20060428_ar_koliagli'
    , '1~Update20060502_kl'
    , '1~Update20060502_algr'
    , '1~Update20060515_al_eali'
    , '1~Update20060518_ga'
    , '1~Update20060518_al'
    , '1~Update20060523_al_bf'
    , '1~Update20060620_ka'
    , '1~Update20060627_al_mw'
    , '1~Update20060707_prozuntlief'
    , '1~Update20060803_ar_koliagli'
    , '1~Update20060804_al_la'
    , '1~Update20060811_al'
    , '1~Update20060823_sy_parameter'
    , '1~Update20061010_re_al_men'
    , '1~Update20061018_haltbarkeit'
    , '1~Update20061106_koli_ko'
    , '1~Update20061108_sl_xx'
    , '1~Update20061108_lo'
    , '1~Update20061116_linie'
    , '1~Update20061215_optprio'
    , '1~Update20070103_sy_parameter'
    , '1~Update20070110_dw_planbasis'
    , '1~Update20070110_sy_parameter'
    , '1~Update20070215_ar_koliagli'
    , '1~Update20070222_kzfifo'
    , '1~Update20070323_ssin_lv'
    , '1~Update20070328_ssin_ve'
    , '1~Update20070403_ssin_lv'
    , '1~Update20070412_ssin_xx'
    , '1~Update20070417_ssin_xx'
    , '1~Update20070417_sy_fekor_ini'
    , '1~Update20070420_ssin_xx'
    , '1~Update20070420_buchungsregel'
    , '1~Update20070420_ge'
    , '1~Update20070430_buchungsregel'
    , '1~Update20070507_gz'
    , '1~Update20070611_al_bw'
    , '1~Update20070807_al_eali'
    , '1~Update20070904_ar_koliagli'
    , '1~Update20070906_sy_parameter'
    , '1~Update20070927_dynamics'
    , '1~Update20070913_sy_parameter2'
    , '1~Update20071005_ssin_xx'
    , '1~Update20071011_koli_ko'
    , '1~Update20071016_sy_parameter2'
    , '1~Update20071026_gz'
    , '1~Update20071029_ssin_lv'
    , '1~Update20071129_dw_planbasis'
    , '1~Update20071205_charge'
    , '1~Update20071205_kl_al'
    , '1~Update20071212_ssin_ba'
    , '1~Update20071218_al_bw'
    , '1~Update20080104_koli_ko'
    , '1~Update20080112_al_bd'
    , '1~Update20080113_er_koli_ko'
    , '1~Update20080116_al_bd'
    , '1~Update20080122_bv_bf'
    , '1~Update20080212_al_bd'
    , '1~Update20080212_al'
    , '1~Update20080213_kl_al'
    , '1~Update20080304_al_eali_ea'
    , '1~Update20080305_ge_log'
    , '1~Update20080307'
    , '1~Update20080312_verwendung'
    , '1~Update20080312_drop_procedure'
    , '1~Update20080313_del_log'
    , '1~Update20080313_indizes'
    , '1~Update20080328_koli_ko'
    , '1~Update20080410_pz'
    , '1~Update20080428'
    , '1~Update20080612_al_bd'
    , '1~Update20080620_ssin_ve'
    , '1~Update20080702_ah'
    , '1~Update20080703_al'
    , '1~Update20080723_ah'
    , '1~Update20080729_loli_lo'
    , '1~Update20080729_lz'
    , '1~Update20080729_sy_parameter'
    , '1~Update20080806_mfe_station'
    , '1~Update20080814_st'
    , '1~Update20080815_ssin_lv_log'
    , '1~Update20080818_sy_parameter'
    , '1~Update20080818_ssin_lv_xx'
    , '1~Update20080901_sy_meldung'
    , '1~Update20080904_sy_parameter'
    , '1~Update20080905_mfe_station'
    , '1~Update20080909_ssin_lv_log'
    , '1~Update20080916_sy_parameter'
    , '1~Update20080916'
    , '1~Update20080919_pz'
    , '1~Update20081016_ka'
    , '1~Update20081105_al_bw'
    , '1~Update20081205_pz'
    , '1~Update20081210_ofmen'
    , '1~Update20081212_ag_pz'
    , '1~Update20081222_re_rc_po'
    , '1~Update20090114_handle'
    , '1~Update20090115_re_aw02'
    , '1~Update20090116_sy_parameter'
    , '1~Update20090116_kpl'
    , '1~Update20090324_ssin_xx'
    , '1~Update20091005_imli'
    , '1~Update20091204_ar_koliagli'
    , '1~Update20091207_ve'
    , '1~Update20100512_al_la'
    , '1~Update20101028_ge'
    , '1~Update20101116_sy_mfe_wbklog'
    , '1~Update20110120'
    , '1~Update20110322'
    , '1~Update20111028_sy_user'
    , '1~Update20120118_ssin_lv'
    , '1~Update20120619_sy_mfe_station'
    , '1~Update20121109_ssin_az'
    , '1~Update20130102_re_kpl_po'
    , '1~Update20130116_sy_parameter'
    , '1~Update20130220_sy_parameter2'
    , '1~Update20130220_ag_pz'
    , '1~Update20130311'
    , '1~Update20130503_fa_apap'
    , '1~Update20130828_al_bf_is'
    , '1~Update20140508'
    , '1~Update20140510'
    , '1~Update20140613_arbeitsplan'
    , '1~Update20140731_fa_kt'
    , '1~Update20140808'
    , '1~Update20140929_bde_fa'
    , '1~Update20141101_out_bde'
    , '1~Update20141201'
    , '1~Update20150410_in_xx_tabellen'
    , '1~Update20150414'
    , '1~Update20150519_sy_parameter'
    , '1~Update20150720'
    , '1~Update20150914_ag'
    , '1~Update20150915'
   	, '1~Update20151007_sy_bde_user'
    , '1~Update20151106_sy_parameter'
    , '1~Update20151106_create'
    , '1~Update20151118'
    , '1~Update20151118_al'
    , '1~Update20151202_ag_pz'
    , '1~Update20151203_KU_PZ'
    , '1~Update20151210_agli'
    , '1~Update20160111'
    , '1~Update20160129_fa'
    , '1~Update20160211_ssin_la'
    , '1~Update20160225_agli_po'
    , '1~Update20160303_agli'
    , '1~Update20160210_fa_fa_bz'
    , '1~Update20160329_al_la'
    , '1~Update20160401_fa_un'
    , '1~Update20160405'
    , '1~Update20160420'
    , '1~Update20160503_lo_alal'
    , '1~Update20160607_agli_gen'
    , '1~Update20160610_sy_parameter'
    , '1~Update20160612_sy_parameter'
    , '1~Update20160629_ag'
    , '1~Update20160805_fa_kt'
    , '1~Update20160812_ssin_ve'
    , '1~Update20160922_ssin_la'
    , '1~Update20161005_lagr'
    , '1~Update20161026_in_artikel'
    , '1~Update20161206_ssin_ve_in_kundenauftrag'
    , '1~Update20161212_ka'
    , '1~Update20161223_sy_parameter2'
    , '1~Update20170127_in_stuecklisten_komponente'
    , '1~Update20170131_sy_parameter2'
    , '1~Update20170301_in_artikel_version'
    , '1~Update20170306_al_mw'
    , '1~Update20170307_sy_parameter'
    , '1~Update20170404_ssin_ve'
    , '1~Update20170405_al_la'
    , '1~Update20170519_sy_parameter'
    , '1~Update20170703'
    , '1~Update20170831_sequence_counter'
    , '1~Update20170901_al_la'
    , '1~Update20171005_ag'
	, '1~Update20171116_create_al_inaktiv'
	, '1~Update20180102_Zusatzfelder_erweitern'
	, '1~Update20180102_sy_parameter'
    );
  tabVersion := T_UpdTab ();
  tabFehlt := T_UpdTab ();
  
  -- Updates pruefen
  FOR i IN tabUpd.FIRST .. tabUpd.LAST LOOP
    -- Geforderte Eigenschaften
    bOK := FALSE;
    iPos := INSTR (tabUpd(i), '~');
    IF ( iPos > 0 ) THEN
      sVer := SUBSTR (tabUpd(i), 1, iPos-1);
      sBez := SUBSTR (tabUpd(i), iPos+1);
      bOK := (LENGTH (sVer) > 0) AND (LENGTH (sBez) > 0);
    END IF;
    IF ( NOT bOK ) THEN
      RAISE_APPLICATION_ERROR (-20000, 'Ungueltige Update-Definition: ' || tabUpd(i));
    END IF;
    
    -- Datenbank pruefen
    SELECT COUNT(*), MAX(Version) INTO iDBAnz, sDBVer
    FROM Sy_Update_Log
    WHERE Bez = sBez;
    
    IF ( iDBAnz < 1 ) THEN
      tabFehlt.EXTEND;
      tabFehlt(tabFehlt.COUNT) := sBez;
    ELSIF ( sDBVer < sVer ) THEN
      tabVersion.EXTEND;
      tabVersion(tabVersion.COUNT) := 
        LPAD (sDBVer, 10) || ' -> ' || RPAD (sVer, 10) || sBez;
    ELSIF ( sDBVer > sVer ) THEN
      tabVersion.EXTEND;
      tabVersion(tabVersion.COUNT) := 
        LPAD (sDBVer, 10) || ' <- ' || RPAD (sVer, 10) || sBez;
    END IF;
  END LOOP;

  -- Report
  IF ( 0 = tabVersion.COUNT + tabFehlt.COUNT ) THEN
    DBMS_OUTPUT.PUT_LINE ('Die Datenbank ist aktuell');
  ELSE
    IF ( tabVersion.COUNT > 0 ) THEN
      DBMS_OUTPUT.PUT_LINE ('Versionskonflikte (Ist - Soll)');
      FOR i IN tabVersion.FIRST .. tabVersion.LAST LOOP
        DBMS_OUTPUT.PUT_LINE (
          '  ' || SUBSTR (tabVersion(i), 1, 24) ||
          '  @m:\FLS\Entwicklung\Oracle\Skripte_Update\' || 
          SUBSTR (tabVersion(i), 24 + 1) || '.sql');
      END LOOP;
    END IF;
    IF ( tabFehlt.COUNT > 0 ) THEN
      DBMS_OUTPUT.PUT_LINE ('Fehlende Updates');
      FOR i IN tabFehlt.FIRST .. tabFehlt.LAST LOOP
        DBMS_OUTPUT.PUT_LINE (
          '  @m:\FLS\Entwicklung\Oracle\Skripte_Update\' || 
          SUBSTR (tabFehlt(i), 1) || '.sql');
      END LOOP;
    END IF;
  END IF;
END;
/

SET FEEDBACK ON;





