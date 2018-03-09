DROP TYPE PackDs_Tab; 

-- ============================================================================
-- Name     : packds_obj
-- Version  : 6.5.1.0
-- Funktion : Object zur Aufnahme gepackter Datensätze
--            Constructor für neuen Datensatz
--            Constructor für neuen Meldungsdatensatz
--            Procedure zum füllen von Spalte VARCHAR
--            Procedure zum füllen von Spalte NUMBER
--            Procedure zum füllen von Spalte DATE
-- Parameter: -
--            
-- Rückgabe : -
-- Ablauf   : 
-- Logbuch  : 01.09.04 mey : erstellt
-- ============================================================================
CREATE OR REPLACE TYPE packds_obj AS object (Tabelle      VARCHAR2(50),
                                             PkText       VARCHAR2(4000),
                                             DatText      VARCHAR2(4000),
                                             PkSpalten    VARCHAR2(1000),
                                             DatSpalten   VARCHAR2(1000),
                                             DsTyp        char(1),
                                             CONSTRUCTOR FUNCTION packds_obj (p_Tabelle VARCHAR2,
                                                                          p_dstyp CHAR) RETURN SELF AS RESULT,                                    
                                             CONSTRUCTOR FUNCTION packds_obj RETURN SELF AS RESULT,                                    
                                             MEMBER PROCEDURE Meldung (p_MeldNr NUMBER,
                                                                              p_MeldTyp VARCHAR2,
                                                                              p_Modul VARCHAR2,
                                                                              p_Func VARCHAR2), 
                                             MEMBER PROCEDURE SpalteT (p_Spaltenname VARCHAR2,p_KzPk NUMBER,p_Wert VARCHAR),
                                             MEMBER PROCEDURE SpalteN (p_Spaltenname VARCHAR2,p_KzPk NUMBER,p_Wert NUMBER),
                                             MEMBER PROCEDURE SpalteD (p_Spaltenname VARCHAR2,p_KzPk NUMBER,p_Wert DATE));
                                             
                                             
/

CREATE OR REPLACE TYPE BODY packds_obj AS                       
  CONSTRUCTOR FUNCTION packds_obj (p_Tabelle VARCHAR2, p_dstyp CHAR)  
    RETURN SELF AS RESULT                                                                                   
  IS                                                                                                    
  -- Constructor für neues Datensatzobject
  BEGIN                                                        
    SELF.Tabelle := p_Tabelle;                                     
    SELF.dstyp := p_dstyp;                                       
    RETURN;                                                    
  END;                                                         

  CONSTRUCTOR FUNCTION packds_obj   
    RETURN SELF AS RESULT                                                                                   
  IS                   
  -- Constructor für neuen Meldungsdatensatz                                                                                     
  BEGIN                                                        
                                         
    RETURN;                                                    
  END;                                                         

  MEMBER PROCEDURE Meldung (p_MeldNr NUMBER,
                           p_MeldTyp VARCHAR2,
                           p_Modul VARCHAR2,
                           p_Func VARCHAR2)  
  IS                   
  -- Constructor für neuen Meldungsdatensatz                                                                                     
  BEGIN                                                        
    DsTyp := 'M';
    SpalteN('MeldNr',-1,p_MeldNr);
    SpalteT('MeldTyp',-1,p_MeldTyp);
    SpalteT('Modul',-1,p_Modul);
    SpalteT('Func',-1,p_Func);
                                        
  END;                                                         

  MEMBER PROCEDURE SpalteT (p_Spaltenname VARCHAR2,p_KzPk NUMBER,p_Wert VARCHAR)
  IS
  BEGIN
    IF p_KzPk = -1 THEN
      PkSpalten := PkSpalten || p_Spaltenname || '/';
      IF p_Wert IS NULL THEN
        PkText := PkText || '-/';
      ELSE
        PkText    := PkText || length(p_Wert) || 'T' || p_Wert || '/';
      END IF;
    ELSE
      DatSpalten := DatSpalten || p_Spaltenname || '/';
      IF p_Wert IS NULL THEN
        DatText := DatText || '-/';
      ELSE
        DatText    := DatText || length(p_Wert) || 'T' || p_Wert || '/';
      END IF;
    END IF;
  END;

  MEMBER PROCEDURE SpalteN (p_Spaltenname VARCHAR2,p_KzPk NUMBER,p_Wert NUMBER)
  IS
  BEGIN
    IF p_KzPk = -1 THEN
      PkSpalten := PkSpalten || p_Spaltenname || '/';
      IF p_Wert IS NULL THEN
        PkText := PkText || '-/';
      ELSE
        PkText    := PkText || 'N' || TO_CHAR(p_Wert,'TM','nls_numeric_characters='',.''') || '/';
      END IF;
    ELSE
      DatSpalten := DatSpalten || p_Spaltenname || '/';
      IF p_Wert IS NULL THEN
        DatText := DatText || '-/';
      ELSE
        DatText    := DatText || 'N' || TO_CHAR(p_Wert,'TM','nls_numeric_characters='',.''') || '/';
      END IF;
    END IF;
  END;

  MEMBER PROCEDURE SpalteD (p_Spaltenname VARCHAR2,p_KzPk NUMBER,p_Wert DATE)
  IS
  BEGIN
    IF p_KzPk = -1 THEN
      PkSpalten := PkSpalten || p_Spaltenname || '/';
      IF p_Wert IS NULL THEN
        PkText := PkText || '-/';
      ELSE
        PkText    := PkText || 'D' || TO_CHAR(p_Wert,'YYYYMMDDHH24MISS') || '/';
      END IF;
    ELSE
      DatSpalten := DatSpalten || p_Spaltenname || '/';
      IF p_Wert IS NULL THEN
        DatText := DatText || '-/';
      ELSE
        DatText    := DatText || 'D' || TO_CHAR(p_Wert,'YYYYMMDDHH24MISS') || '/';
      END IF;
    END IF;
  END;

END;                                                           
      
/         

-- ============================================================================
-- Name     : packds_obj
-- Version  : 6.5.1.0
-- Funktion : Object zur Aufnahme gepackter Datensätze
-- Parameter: -
--            
-- Rückgabe : -
-- Ablauf   : 
-- Logbuch  : 01.09.04 mey : erstellt
-- ============================================================================
CREATE OR REPLACE TYPE PackDs_Tab IS TABLE OF PackDs_obj;

/

                               