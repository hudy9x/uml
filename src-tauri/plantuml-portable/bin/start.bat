@echo off
set BASE=%~dp0

set GRAPHVIZ_DOT=%BASE%graphviz\bin\dot.exe
set OUT_DIR=%BASE%output

REM create output folder if not exists
if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

"%BASE%jre\java\bin\java.exe" ^
  -DGRAPHVIZ_DOT="%GRAPHVIZ_DOT%" ^
  -jar "%BASE%plantuml-1.2025.10.jar" ^
  -tsvg ^
  -o "%OUT_DIR%" ^
  %*
