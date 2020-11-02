<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Arqueossítios</title>
      </head>
      <body>
        <table width="100%" border="1">
          <tr>
            <td width="30%" valign="top">
              <h3>Índice</h3>
              <a name="indice"/>
              <ul>
                <xsl:apply-templates mode="indice" select="//ARQELEM">
                  <xsl:sort select="IDENTI"/>
                </xsl:apply-templates>
              </ul>
              
            </td>
            <td>
              <xsl:apply-templates select="//ARQELEM">
              <xsl:sort select="IDENTI"/>

              </xsl:apply-templates>
            </td>
          </tr>
        </table>
      </body>
    </html>
  </xsl:template>
  
  <!-- TEMPLATE PARA INDICE ....................................................-->
  <xsl:template match="ARQELEM" mode="indice">
    <li>
      <a href="#{generate-id()}">
      <xsl:value-of select="IDENTI"/>
      </a>
    </li>
  </xsl:template>
  
  <!-- TEMPLATE PARA CONTEUDO ....................................................-->
  <xsl:template match="ARQELEM">
    <a name="{generate-id()}"/>
    <p><b>Nome: </b><xsl:value-of select="IDENTI"/></p>
    <xsl:if test="LUGAR">
    <p><b>Lugar: </b><xsl:value-of select="LUGAR"/></p>
    </xsl:if>
    <xsl:if test="FREGUE">
    <p><b>Freguesia: </b><xsl:value-of select="FREGUE"/></p>
    </xsl:if>
      <xsl:if test="CONCEL">
    <p><b>Concelho: </b><xsl:value-of select="CONCEL"/></p>
      </xsl:if>
        <xsl:if test="ACESSO">
    <p><b>Acesso: </b><xsl:value-of select="ACESSO"/></p>
        </xsl:if>
    <address>[<a href="#indice">Voltar ao índice</a>]</address>
    <center>
      <hr width="80%"/>
    </center>

  </xsl:template>

</xsl:stylesheet>
