#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "graphviz::gvpr" for configuration "Release"
set_property(TARGET graphviz::gvpr APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(graphviz::gvpr PROPERTIES
  IMPORTED_IMPLIB_RELEASE "${_IMPORT_PREFIX}/lib/gvpr.lib"
  IMPORTED_LINK_DEPENDENT_LIBRARIES_RELEASE "graphviz::cgraph;graphviz::gvc"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/gvpr.dll"
  )

list(APPEND _cmake_import_check_targets graphviz::gvpr )
list(APPEND _cmake_import_check_files_for_graphviz::gvpr "${_IMPORT_PREFIX}/lib/gvpr.lib" "${_IMPORT_PREFIX}/bin/gvpr.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
